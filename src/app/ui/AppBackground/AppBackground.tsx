import backgroundWebp from "@/assets/night-street.webp";
import backgroundJpeg from "@/assets/night-street.jpg";
import styles from "./AppBackground.module.scss";

function AppBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <picture className={styles.picture}>
        <source type="image/webp" srcSet={backgroundWebp} />

        <img
          className={styles.image}
          src={backgroundJpeg}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
      </picture>

      <div className={styles.overlay} />
    </div>
  );
}

export default AppBackground;
