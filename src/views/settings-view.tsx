import { Settings } from "@model";
import { libraryService } from "@services";
import { css } from "@utils";
import { useSubject } from "observational/hooks";

const style = css`
	.settings {
		padding-top: 100px;
	}

	.settings input {
		appearance: auto;
	}

	.panel {
		background: #111;
		padding: 1rem;
	}

	.field {
		padding: 0.5rem 0;
	}
`;

export function SettingsView() {
	const [settings, setSettings] = useSubject(libraryService.subSettings);
	function updateSettings(newSettings: Partial<Settings>) {
		if (!settings)
			return;
		setSettings({ ...settings, ...newSettings });
	}
	function toggleSetting(setting: keyof Settings) {
		if (!settings)
			return;
		updateSettings({ ...settings, [setting]: !settings[setting] })
	}
	return (
		<div className={style.settings}>
			<h4>Settings</h4>
			<div className={style.panel}>
				<form>
					<div className={style.field}>
						<input 
							id="grouped"
							type="checkbox"
							checked={settings?.grouped}
							onChange={() => toggleSetting("grouped")}
						/>
						<label htmlFor="grouped">Show Grouping</label>
					</div>
					<div className={style.field}>
						<input 
							id="showFormative"
							type="checkbox" 
							checked={settings?.showFormative}
							onChange={() => toggleSetting("showFormative")}
						/>
						<label htmlFor="showFormative">Show Formative</label>
					</div>
				</form>
			</div>
			<h4>About</h4>
			<div className={style.panel}>
				<p>
					This application was built by Dale Blackwood to archive and display some lesser
					known works.
				</p>
				<p>
					The application was built using React, Vite and Howler.
				</p>
			</div>
		</div>
	);
}
