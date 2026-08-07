/** Custom install prompt which deliberately replaces the browser's default UI. */
export function InstallSheet({ onInstall, onLater }) {
  return <section className="experience-sheet" role="dialog" aria-modal="true" aria-labelledby="install-title"><div className="experience-sheet__handle" /><div className="experience-sheet__icon">+</div><p className="experience-sheet__eyebrow">DOCTOR INQUIRY</p><h2 id="install-title">Keep care within reach</h2><p>Install Doctor Inquiry for a faster, full-screen experience that stays available offline.</p><div className="experience-sheet__actions"><button className="experience-sheet__primary" type="button" onClick={onInstall}>Install app</button><button className="experience-sheet__later" type="button" onClick={onLater}>Later</button></div></section>;
}
