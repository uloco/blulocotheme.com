import Image from "next/image";
import { Logo, TerminalGlyph } from "@/components/Logo";
import { CodeWindow } from "@/components/CodeWindow";
import { PaletteTable } from "@/components/PaletteTable";
import { Snippet } from "@/components/Snippet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatCount, getStars, totalStars, type Stars } from "@/lib/github";
import {
  community,
  editors,
  links,
  otherTerminals,
  terminalCount,
  terminals,
  tools,
  type Port,
} from "@/lib/ports";
import styles from "./page.module.css";

export default async function Home() {
  const stars = await getStars();
  const total = totalStars(stars);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.brand}>
            <Image src="/logo.svg" alt="" width={26} height={26} priority />
            <span>bluloco</span>
          </a>
          <nav className={styles.nav}>
            <a href="#editors">Editors</a>
            <a href="#terminals">Terminals</a>
            <a href="#palette">Palette</a>
            <a href={links.github} className={styles.navGithub}>
              GitHub
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Since 2017</p>
          <h1 className={styles.title}>Bluloco</h1>
          <p className={styles.tagline}>
            A fancy and sophisticated color scheme. Dark and light. Built on a comprehensive use of
            syntax scopes, with due regard to contrast and readability.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.primary}
              href="https://marketplace.visualstudio.com/items?itemName=uloco.theme-bluloco-dark"
            >
              <Logo name="vscode" size={17} />
              Get it for VS Code
            </a>
            <a className={styles.secondary} href="#editors">
              All editors
            </a>
          </div>
          <dl className={styles.stats}>
            <Stat value="1M+" label="installs" />
            <Stat value={total} label="GitHub stars" />
            <Stat value={terminalCount.toString()} label="terminals" />
            <Stat value="4" label="variants" />
          </dl>
        </section>

        <section className={styles.showcase}>
          <CodeWindow />
          <p className={styles.showcaseNote}>
            The page you are reading uses the palette below. Flip the switch up there to see the
            other variant.
          </p>
        </section>

        <Section
          id="editors"
          eyebrow="Editors"
          heading="Pick your editor"
          lead="Four official ports, all maintained here. Every one ships a dark and a light variant."
        >
          <div className={`${styles.cards} ${styles.cardsWide}`}>
            {editors.map((port) => (
              <PortCard key={port.name} port={port} stars={stars} />
            ))}
          </div>
        </Section>

        <Section
          id="terminals"
          eyebrow="Terminals"
          heading="Already in your terminal"
          lead="Bluloco ships with these. Nothing to download, just name the scheme."
        >
          <div className={styles.cards}>
            {terminals.map((port) => (
              <PortCard key={port.name} port={port} stars={stars} />
            ))}
          </div>
          <div className={styles.chips}>
            <p className={styles.chipsLabel}>
              Also generated for {otherTerminals.length} more, and for even more targets via{" "}
              <a href="https://github.com/mbadolato/iTerm2-Color-Schemes" className={styles.link}>
                iTerm2-Color-Schemes
              </a>
              . The files live in{" "}
              <a
                href="https://github.com/uloco/bluloco.nvim/tree/main/terminal-themes"
                className={styles.link}
              >
                bluloco.nvim
              </a>
              .
            </p>
            <ul className={styles.chipList}>
              {otherTerminals.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="tools"
          eyebrow="Command line"
          heading="And the rest of the toolchain"
          lead="Themes for the tools you keep open next to the editor."
        >
          <ul className={styles.tools}>
            {tools.map((tool) => (
              <li key={tool.name}>
                <a href={tool.href} className={styles.tool}>
                  <span className={styles.toolName}>{tool.name}</span>
                  <span className={styles.toolBlurb}>{tool.blurb}</span>
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="community"
          eyebrow="Community"
          heading="Ported by other people"
          lead="Not maintained by me, but verified to work. Thanks to everyone on this list."
        >
          <ul className={styles.community}>
            {community.map((port) => (
              <li key={port.repo}>
                <a href={`https://github.com/${port.repo}`} className={styles.communityRow}>
                  <span className={styles.communityName}>{port.name}</span>
                  <span className={styles.communityAuthor}>{port.author}</span>
                  <span className={styles.communityVariants}>{port.variants}</span>
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="palette"
          eyebrow="Palette"
          heading="Thirteen scopes"
          lead="Each color maps to a meaning and keeps that meaning in every language. Click a value to copy it."
        >
          <PaletteTable />
          <p className={styles.paletteNote}>
            Want to check it against your own code? The{" "}
            <a href={links.samples} className={styles.link}>
              syntax highlighting samples
            </a>{" "}
            repo has snippets for a long list of languages.
          </p>
        </Section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src="/logo.svg" alt="" width={30} height={30} />
            <p>
              Bluloco is made by{" "}
              <a href={links.author} className={styles.link}>
                Umut Topuzoğlu
              </a>
              . Keeping it current with every editor release takes real time, so if it makes your day
              nicer, consider{" "}
              <a href={links.buyMeACoffee} className={styles.link}>
                buying a coffee
              </a>{" "}
              or{" "}
              <a href={links.paypal} className={styles.link}>
                donating via PayPal
              </a>
              .
            </p>
          </div>
          <p className={styles.footerMeta}>
            LGPL-3.0. Originally forked from One Dark, then taken somewhere else entirely.
          </p>
        </div>
      </footer>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statValue}>{value}</dt>
      <dd className={styles.statLabel}>{label}</dd>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  heading,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHead}>
        <p className={styles.sectionEyebrow}>{eyebrow}</p>
        <h2 className={styles.sectionHeading}>{heading}</h2>
        <p className={styles.sectionLead}>{lead}</p>
      </div>
      {children}
    </section>
  );
}

function PortCard({ port, stars }: { port: Port; stars: Stars }) {
  const count = port.repo ? stars[port.repo] : undefined;

  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.cardIcon}>
          {port.logo ? <Logo name={port.logo} /> : <TerminalGlyph />}
        </span>
        <h3 className={styles.cardTitle}>{port.name}</h3>
        {count ? (
          <span className={styles.starBadge} title={`${count} stars on GitHub`}>
            <StarIcon />
            {formatCount(count)}
          </span>
        ) : null}
      </div>
      <p className={styles.cardBlurb}>{port.blurb}</p>
      {port.install ? (
        <Snippet code={port.install.code} lang={port.install.lang} plain={port.install.lang === "text"} />
      ) : null}
      {port.note ? <p className={styles.cardNote}>{port.note}</p> : null}
      <a className={styles.cardLink} href={port.href}>
        {port.hrefLabel}
        <Arrow />
      </a>
    </article>
  );
}

function Arrow() {
  return (
    <svg
      className={styles.arrow}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14m-6-7 7 7-7 7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9z" />
    </svg>
  );
}
