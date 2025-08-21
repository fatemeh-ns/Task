export const renderNextMonthDays = (daysContainer, nextMonthDays) => {
  for (let i = 0; i < nextMonthDays; i++) {
    daysContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="next_month_days">${i + 1}</div>`
    );
  }
};

export const renderPrevMonthDays = (daysContainer, jsDay, prevMonthDays) => {
  for (let i = 0; i < jsDay; i++) {
    daysContainer.insertAdjacentHTML(
      "afterbegin",
      `<div class="prev_month_days">${prevMonthDays - i}</div>`
    );
  }
};

export const renderCurrentMonthDays = (
  month,
  year,
  today,
  daysInMonth,
  res,
  daysContainer
) => {  
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const hasEvent = res.some((event) => event.day === d);

    const classes = ["current_month_days"];
    if (isToday) classes.push("today");
    if (hasEvent) classes.push("has-event");

    daysContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="${classes.join(" ")}">${d}</div>`
    );
  }
};

export const renderDayEvents = (
  daysContainer,
  eventsContainer,
  res,
  months
) => {
  daysContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("has-event")) {
      eventsContainer.classList.add("active");
      const dayClicked = parseInt(e.target.textContent);
      const eventsForDay = res.filter(
        (event) => parseInt(event.day) === dayClicked
      );
      const isHoliday = eventsForDay.some((ev) => ev.is_holiday === 1);
      if (isHoliday) {
        e.target.classList.add("holiday");
      }

      eventsContainer.innerHTML = "";
      eventsForDay.forEach((ev) => {
        eventsContainer.insertAdjacentHTML(
          "beforeend",
          `<h3>${ev.day} ${months[ev.month]} : ${ev.title}</h3>
             <div>${ev.description}</div>
             `
        );
      });
    }
  });
};
