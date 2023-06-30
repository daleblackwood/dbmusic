#!/bin/bash
echo "DBMusicSync $@"

help() {
	echo ""
 	echo "Please set the variables DBMSYNC_HOST and DBMSYNC_HOST_FOLDER before running this script."
    echo "  i.e.: export DBMSYNC_HOST=your.remote.host (remote host)"
    echo "        export DBMSYNC_HOST_FOLDER=path/to/remote/folder (remote host library folder)"
    echo "        export DBMSYNC_SSH_KEY=~/.ssh/id_rsa (ssh key)"
	echo "You can also set the following:"
    echo "        export DBMSYNC_LIB_PATH=~/dbmusiclib (local library folder)"
    exit 1
}

if [[ -z "$DBMSYNC_HOST" || -z "$DBMSYNC_HOST_FOLDER" ]]; then help; fi

CD=$PWD
DBMSYNC_LIB_PATH=${DBMSYNC_LIB_PATH:-~/dbmusiclib}
DBMSYNC_SSH_KEY=${DBMSYNC_SSH_KEY:-~/.ssh/id_rsa}
BACKUP1="$HOME/dbmusiclib1.tar"
BACKUP2="$HOME/dbmusiclib2.tar"
CONFIRM=false
SCRIPT=$0
DIRECTION=$1

remote_backup() {
    ssh -i $DBMSYNC_SSH_KEY "$DBMSYNC_HOST" "cd $DBMSYNC_HOST_FOLDER && tar -cf $BACKUP1 *" || {
        echo "Error: Failed to execute remote backup."
        exit 1
    }
    ssh -i $DBMSYNC_SSH_KEY "$DBMSYNC_HOST" "if [ -f $BACKUP1 ]; then mv $BACKUP1 $BACKUP2; fi" || {
        echo "Error: Failed to rename remote backup file."
        exit 1
    }
    ssh -i $DBMSYNC_SSH_KEY "$DBMSYNC_HOST" "rm -f $BACKUP1" || {
        echo "Error: Failed to remove temporary remote backup file."
        exit 1
    }
}

local_backup() {
    if [ -f $BACKUP1 ]; then
        if [ -f $BACKUP2 ]; then
            rm -f $BACKUP2 || {
                echo "Error: Failed to remove previous local backup."
                exit 1
            }
        fi
        mv $BACKUP1 $BACKUP2 || {
            echo "Error: Failed to rename local backup file."
            exit 1
        }
    fi
	if [ -d "$DBMSYNC_LIB_PATH" ]; then
		echo "Creating backup of $DBMSYNC_LIB_PATH as $BACKUP1..."
		(cd $DBMSYNC_LIB_PATH; tar -cf $BACKUP1 .) || {
			echo "Error: Failed to create local backup."
			exit 1
		}
	fi
}

perform_sync() {
	mkdir -p $DBMSYNC_LIB_PATH
	OP_NAME="syncing"
	ARG_DRY_RUN=""
	if $CONFIRM; then
		if [[ $DIRECTION == "up" ]]; then
			remote_backup
		elif [[ $DIRECTION == "down" ]]; then
			local_backup
		fi
	else
		ARG_DRY_RUN="--dry-run"
		OP_NAME="previewing sync"
	fi

	if [[ $DIRECTION == "up" ]]; then
		SYNC_SRC="$DBMSYNC_LIB_PATH"
		SYNC_DEST="$DBMSYNC_HOST:$DBMSYNC_HOST_FOLDER" 
	elif [[ $DIRECTION == "down" ]]; then
		SYNC_SRC="$DBMSYNC_HOST:$DBMSYNC_HOST_FOLDER" 
		SYNC_DEST="$DBMSYNC_LIB_PATH"
	else
		print "Unknown perform_sync direction"
		exit 1
	fi

	if [[ -z $SYNC_SRC ]]; then echo "src not specified"; exit 1; fi
	if [[ -z $SYNC_DEST ]]; then echo "dest not specified"; exit 1; fi

	OP_NAME="$OP_NAME:$DIRECTION"

	echo "$OP_NAME from $SYNC_SRC to $SYNC_DEST..."
	rsync -azvtr --progress -e "ssh -i \"$DBMSYNC_SSH_KEY\"" $ARG_DRY_RUN "$SYNC_SRC" "$SYNC_DEST" || {
		echo "Error: Failed to perform $OP_NAME"
		#exit 1
	}
	EC=$?
	if $CONFIRM; then
		if [[ $EC -eq 0 ]]; then
			echo "$OP_NAME from $SYNC_SRC to $SYNC_DEST complete"
		else
			echo "rsync exited with code $EC"
		fi
	else
		echo ""
		read -p "Are you sure you want to sync $DIRECTION from $SYNC_SRC to $SYNC_DEST? <y/N> " prompt
		if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]; then
			CONFIRM=true
			perform_sync $DIRECTION
		fi
	fi
}

if [[ $# -lt 1 ]]; then
    echo "Invalid argument. Usage: $SCRIPT [up/down] [-y]"
    exit 1
fi

if [[ $DIRECTION != "up" && $DIRECTION != "down" ]]; then
    echo "Invalid argument. Usage: $SCRIPT [up/down] [-y]"
    exit 1
fi

for arg in "$@"; do
    case "$arg" in
        "--force")
           	CONFIRM=true
        	;;
		"--help")
			help
			;;
    esac
done

perform_sync $DIRECTION
