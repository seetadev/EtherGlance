import styles from "./miscItems.module.css";

export function Hr() {
  return <div className={styles.hr}></div>;
}

type LoadingComponentType = {
  useBig?: boolean;
};

export function LoadingComponent({ useBig = false }: LoadingComponentType) {
  return (
    <div
      className={
        useBig
          ? `${styles.imgLoading} ${styles.imgLoadingBig}`
          : `${styles.imgLoading}`
      }
    >
      {[1, 2, 3, 4, 5].map((foo, index) => {
        void foo;
        return (
          <div className={styles.imgLoadingItem} key={`foo-key-${index}`}></div>
        );
      })}
    </div>
  );
}
