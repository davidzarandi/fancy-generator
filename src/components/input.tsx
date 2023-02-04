import {
  HTMLInputTypeAttribute,
  useEffect,
  useMemo,
  useState,
} from "react";
import { debounce, interval, Subject } from "rxjs";
import styles from "@/styles/input.module.css";

type ValidationResult = string | null;

type Props = {
  id: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  validatorFn?: (newValue: string) => ValidationResult;
};

/**
 * Input field component
 * @param id
 * @param label
 * @param type
 * @param placeholder
 * @param validation In case there is an error, it should return a string otherwise it should return null
 */
export default function Input({ id, label, type, placeholder, validatorFn }: Props) {
  const [errorMsg, setErrorMsg] = useState<ValidationResult>(null);
  const changeSubject = useMemo(() => new Subject<string>(), []);

  useEffect(() => {
    if (!validatorFn) {
      return;
    }

    const subscription = changeSubject
      .pipe(debounce(() => interval(300)))
      .subscribe((newValue) => setErrorMsg(validatorFn(newValue)));

    return () => subscription.unsubscribe();
  });

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={styles.input}
        onChange={(event) => changeSubject.next(event.currentTarget.value)}
        maxLength={255}
        onBlur={(event) => changeSubject.next(event.currentTarget.value)}
        data-invalid={errorMsg !== null}
      />
      <span className={styles.error}>{errorMsg}</span>
    </div>
  );
}
