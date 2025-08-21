export async function saveMonth(month) {
  try {
    const response = await fetch("/Task/backend/save_month.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ month }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("خطا در ارسال:", error);
    return null;
  }
}

export async function getEvents(month, year) {
  try {
    const response = await fetch("/Task/backend/get_events.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: month + 1, year }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("خطا در ارسال:", error);
    return null;
  }
}
