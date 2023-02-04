import { FormEventHandler, useState } from "react";
import Head from "next/head";
import { Open_Sans } from "@next/font/google";
import styles from "@/styles/home.module.css";
import Input from "@/components/input";
import validatorFns from "@/validators";

const openSans = Open_Sans({ subsets: ["latin"] });

export default function Home() {
  const [badgeSVGURL, setBadgeSVGURL] = useState<string | null>(null);
  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const {
      label: { value: label },
      iconURL: { value: iconURL },
      brandColor: { value: brandColor },
      textColor: { value: textColor },
    } = event.currentTarget;
    const parameters = new URLSearchParams({ label, iconURL, brandColor, textColor });

    fetch(`/api/svg?${parameters.toString()}`, {
      method: "GET",
    })
      .then((result) => {
        return result.json();
      })
      .then(({ fileURL }: { fileURL: string }) => {
        setBadgeSVGURL(fileURL);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Head>
        <title>Fancy Generator</title>
        <meta name="description" content="Readme badge generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h2 className={`${styles.application_heading} ${openSans.className}`}>
            Readme badge generator
          </h2>
          <form onSubmit={onSubmitHandler} className={styles.form}>
            <Input id="label" label="Label" placeholder="NestJS" validatorFn={validatorFns.text} />
            <Input
              id="iconURL"
              label="Icon URL"
              placeholder="https://simpleicons.org/icons/nestjs.svg"
              validatorFn={validatorFns.URL}
            />
            <Input
              id="brandColor"
              label="Brand color (hex)"
              placeholder="e0234e"
              validatorFn={validatorFns.hex}
            />
            <Input
              id="textColor"
              label="Text color (hex)"
              placeholder="f5f5f5"
              validatorFn={validatorFns.hex}
            />
            <button type="submit">Generate</button>
          </form>
          <div>
            {badgeSVGURL !== null && (
              <>
                <img src={badgeSVGURL} alt="Generated badge" />
                <span>{badgeSVGURL}</span>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
