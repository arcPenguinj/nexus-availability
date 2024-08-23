"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { sendEmail } from "./server/email";

interface Slot {
  date?: Date;
  available: boolean;
  lastChecked: Date;
}

const REFRESH_INTERVAL = 30;

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [slots, setSlots] = useState<Slot>();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const countDown = () => {
    setTimeLeft(timeLeft - 1);
  };

  async function fetchData() {
    setIsLoading(true);
    const res = await fetch(
      "https://ttp.cbp.dhs.gov/schedulerapi/slot-availability?locationId=5020"
    );

    let shouldContinue = false;

    if (!res.ok) {
      setIsError(true);
      setErrorMessage(res.statusText);
    } else {
      setIsError(false);
      const data = await res.json();
      if (data.lastPublishedDate == null) {
        setIsError(true);
        setErrorMessage("No updated date.");
      }
      else if (data.availableSlots.length === 0) {
        setSlots({
          available: false,
          lastChecked: new Date(),
        });
        shouldContinue = true;
      } else {
        setSlots({
          date: new Date(data.availableSlots[0].startTimestamp),
          available: true,
          lastChecked: new Date(),
        });
        // sendEmail(data.availableSlots[0].startTimestamp);
        shouldContinue = true;
      }
    }

    setIsLoading(false);

    if (shouldContinue) {
      setTimeLeft(REFRESH_INTERVAL);
    }
  }


  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(countDown, 1000) as unknown as number;
    } else {
      fetchData();
    }
  }, [timeLeft]);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Nexus interview slots at Blaine, WA</p>
        <div>Next refreshing in {timeLeft} seconds</div>
      </div>

      <div className={styles.center}>
        {!isError && isLoading && <PulseLoader color="#2426ef" />}
        {isError && <div>Error: {errorMessage}</div>}
        {!isError && !isLoading && (
          <div>
            {slots?.available ? (
              <div>
                <h1>Available - {slots?.date?.toLocaleString()}</h1>
                <p>Last checked: {slots?.lastChecked.toLocaleString()}</p>
              </div>
            ) : (
              <div>
                <h1>Not available</h1>
                <p>Last checked: {slots?.lastChecked.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <a
          href="https://ttp.cbp.dhs.gov/schedulerui/"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Schedule <span>-&gt;</span>
          </h2>
          <p>Schedule an interview</p>
        </a>

        <a
          href="https://www.cbp.gov/travel/trusted-traveler-programs/nexus"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Nexus <span>-&gt;</span>
          </h2>
          <p>Learn more about Nexus program</p>
        </a>

        <a
          href="https://ttp.cbp.dhs.gov/"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Apply <span>-&gt;</span>
          </h2>
          <p>
            Apply Nexus at the official U.S. Department of Homeland Security
            website
          </p>
        </a>
      </div>
    </main>
  );
}
