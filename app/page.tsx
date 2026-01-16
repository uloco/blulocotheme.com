import styles from "./page.module.css";

const themes = [
  { name: "VSCode", link: "#" },
  { name: "Zed", link: "#" },
  { name: "IntelliJ", link: "#" },
  { name: "Neovim", link: "#" },
  { name: "Ghostty", link: "#" },
  { name: "iTerm2", link: "#" },
];

const colors = [
  { name: "Blue", hex: "#5d88d4" },
  { name: "Purple", hex: "#8a5dff" },
  { name: "Pink", hex: "#ff5dff" },
  { name: "Orange", hex: "#ff8a5d" },
  { name: "Yellow", hex: "#ffff5d" },
  { name: "Green", hex: "#5dff8a" },
];

const socialLinks = [
  { name: "GitHub", link: "#" },
  { name: "Twitter", link: "#" },
  { name: "Discord", link: "#" },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Bluloco Themes</h1>
        <p className={styles.heroSubtitle}>
          A collection of beautiful themes for your favorite editors and terminals.
        </p>
        <button className={styles.heroButton}>Explore Themes</button>
      </section>
      <section className={styles.showcase}>
        <h2 className={styles.showcaseTitle}>Available Themes</h2>
        <div className={styles.showcaseGrid}>
          {themes.map((theme) => (
            <div key={theme.name} className={styles.showcaseCard}>
              <h3>{theme.name}</h3>
              <a href={theme.link} className={styles.showcaseLink}>View Theme</a>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.palette}>
        <h2 className={styles.paletteTitle}>Color Palette</h2>
        <div className={styles.paletteGrid}>
          {colors.map((color) => (
            <div key={color.name} className={styles.paletteCard}>
              <div className={styles.paletteSwatch} style={{ backgroundColor: color.hex }}></div>
              <p className={styles.paletteName}>{color.name}</p>
              <p className={styles.paletteHex}>{color.hex}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>© {new Date().getFullYear()} Bluloco Themes. All rights reserved.</p>
          <div className={styles.footerLinks}>
            {socialLinks.map((social) => (
              <a key={social.name} href={social.link} className={styles.footerLink}>
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}