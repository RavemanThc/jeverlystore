import styles from "./Icon.module.css";
const paths = {
  menu: "M4 7h16M4 12h16M4 17h16",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  bag: "M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2",
  user: "M20 21v-2a7 7 0 0 0-14 0v2M17 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  arrow: "M3 12h18m-7-7 7 7-7 7",
  close: "m6 6 12 12M6 18 18 6",
};
export default function Icon({ name }: { name: keyof typeof paths }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
