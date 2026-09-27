import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const DateSelectionContext = createContext(null);

const MONTHS = [
  "JAN.",
  "FÉV.",
  "MAR.",
  "AVR.",
  "MAI",
  "JUIN",
  "JUIL.",
  "AOÛT",
  "SEPT.",
  "OCT.",
  "NOV.",
  "DÉC.",
];

const WEEKDAYS = [
  "DIM.",
  "LUN.",
  "MAR.",
  "MER.",
  "JEU.",
  "VEN.",
  "SAM.",
];

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function formatApiDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(date) {
  return `${WEEKDAYS[date.getDay()]} ${String(
    date.getDate()
  ).padStart(2, "0")} ${MONTHS[date.getMonth()]}`;
}

function createDateItems(today = new Date()) {
  const result = [];

  const start = addDays(today, -7);

  for (let index = 0; index < 15; index += 1) {
    const date = addDays(start, index);

    result.push({
      key: formatApiDate(date),
      date,
      label: formatDateLabel(date),
    });
  }

  return result;
}

function getMillisecondsUntilNextMidnight() {
  const now = new Date();

  const nextMidnight = new Date(now);

  nextMidnight.setHours(24, 0, 0, 0);

  return Math.max(
    1000,
    nextMidnight.getTime() - now.getTime()
  );
}

export function DateSelectionProvider({ children }) {
  const [currentDayKey, setCurrentDayKey] = useState(() =>
    formatApiDate(new Date())
  );

  const [selectedDate, setSelectedDate] = useState(
    () => formatApiDate(new Date())
  );

  const [liveMode, setLiveMode] = useState(false);

  const refreshCurrentDay = useCallback(() => {
    const newTodayKey = formatApiDate(new Date());

    setCurrentDayKey((previous) => {
      if (previous === newTodayKey) {
        return previous;
      }

      setSelectedDate(newTodayKey);
      setLiveMode(false);

      return newTodayKey;
    });
  }, []);

  useEffect(() => {
    let timeoutId;

    const scheduleMidnightRefresh = () => {
      timeoutId = setTimeout(() => {
        refreshCurrentDay();
        scheduleMidnightRefresh();
      }, getMillisecondsUntilNextMidnight());
    };

    scheduleMidnightRefresh();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [refreshCurrentDay]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshCurrentDay();
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [refreshCurrentDay]);

  const dates = useMemo(() => {
    return createDateItems(new Date());
  }, [currentDayKey]);

  const todayKey = currentDayKey;

  const yesterdayKey = useMemo(() => {
    return formatApiDate(
      addDays(new Date(), -1)
    );
  }, [currentDayKey]);

  const tomorrowKey = useMemo(() => {
    return formatApiDate(
      addDays(new Date(), 1)
    );
  }, [currentDayKey]);

  const selectDate = useCallback((dateKey) => {
    setSelectedDate(dateKey);
    setLiveMode(false);
  }, []);

  const selectLive = useCallback(() => {
    setLiveMode(true);
    setSelectedDate(todayKey);
  }, [todayKey]);

  const value = useMemo(() => {
    return {
      dates,
      todayKey,
      yesterdayKey,
      tomorrowKey,
      selectedDate,
      liveMode,
      selectDate,
      selectLive,
      refreshCurrentDay,
    };
  }, [
    dates,
    todayKey,
    yesterdayKey,
    tomorrowKey,
    selectedDate,
    liveMode,
    selectDate,
    selectLive,
    refreshCurrentDay,
  ]);

  return (
    <DateSelectionContext.Provider value={value}>
      {children}
    </DateSelectionContext.Provider>
  );
}

export function useDateSelection() {
  const context = useContext(DateSelectionContext);

  if (!context) {
    throw new Error(
      "useDateSelection must be used inside DateSelectionProvider."
    );
  }

  return context;
}
