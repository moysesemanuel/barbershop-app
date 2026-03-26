import styles from "./home-sections.module.css";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
};

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}
