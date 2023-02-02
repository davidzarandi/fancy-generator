import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/home.module.css";
import Input from "@/components/input";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Fancy Generator</title>
        <meta name="description" content="Readme badge generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="flex w-full max-w-md space-y-8">
          <div>
            <Input />
          </div>
        </div>
      </main>
    </>
  );
}
