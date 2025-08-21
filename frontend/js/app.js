import { saveMonth, getEvents } from "./api.js";
import {
  renderNextMonthDays,
  renderPrevMonthDays,
  renderCurrentMonthDays,
  renderDayEvents,
} from "./functions.js";

import {
  $,
  monthToggle,
  yearToggle,
  monthDropdown,
  yearDropdown,
  monthName,
  yearInputElm,
  yearBtnElm,
  addEventForm,
  addEventBtn,
  goTodayBtn,
  prevBtn,
  nextBtn,
  monthItem,
  yearErrorElm,
  daysContainer,
  eventsContainer,
  months,
} from "./calendarElements.js";

const today = new Date();
let selectedDate = { year: today.getFullYear(), month: today.getMonth() };

// Init calendar on page load
$.addEventListener("DOMContentLoaded", () => {
  renderCalendar(today.getFullYear(), today.getMonth());

  saveMonth(today.getMonth(), today.getFullYear()).then((data) => {
    if (data && data.month) {
      updateCalendarHeader(today.getFullYear(), months[data.month]);
    }
  });
});

monthItem.forEach((li, index) => {
  const title = li.querySelector(".month__list-title");
  const monthText = title.textContent.trim();
  sessionStorage.setItem("selectedMonth", monthText);

  // Handle month change
  li.addEventListener("click", (e) => {
    e.stopPropagation();
    renderCalendar(selectedDate.year, index);
    saveMonth(index + 1).then((data) => {
      if (data && data.month) {
        updateCalendarHeader(selectedDate.year, months[index]);
        selectedDate = { ...selectedDate, month: index };
      }
    });
  });
});

monthToggle.addEventListener("click", () => {
  monthDropdown.classList.toggle("active");
});

yearToggle.addEventListener("click", () => {
  yearDropdown.classList.toggle("active");
});

addEventBtn.addEventListener("click", () => {
  addEventForm.classList.toggle("active");
});

goTodayBtn.addEventListener("click", () => {
  if (
    selectedDate.month === today.getMonth() &&
    selectedDate.year === today.getFullYear()
  ) {
    return;
  }

  selectedDate = { year: today.getFullYear(), month: today.getMonth() };
  renderCalendar(selectedDate.year, selectedDate.month);
  updateCalendarHeader(selectedDate.year, months[selectedDate.month]);
});

prevBtn.addEventListener("click", () => {
  let year = selectedDate.year;
  let month = selectedDate.month - 1;

  if (month < 0) {
    month = 11;
    year -= 1;
  }

  selectedDate = { ...selectedDate, year, month };
  renderCalendar(year, month);
  updateCalendarHeader(year, months[month]);
  saveMonth(month + 1, year);
});

nextBtn.addEventListener("click", () => {
  let year = selectedDate.year;
  let month = selectedDate.month + 1;

  if (month > 11) {
    month = 0;
    year += 1;
  }

  selectedDate = { ...selectedDate, year, month };
  renderCalendar(year, month);
  updateCalendarHeader(year, months[month]);
  saveMonth(month + 1, year);
});

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Render full calendar (prev, current, next month days + events)
function renderCalendar(year, month) {
  eventsContainer.innerHTML = "";

  monthDropdown.classList.remove("active");
  yearDropdown.classList.remove("active");
  daysContainer.innerHTML = "";

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

  let jsDay = new Date(year, month, 1).getDay();
  let daysInMonth = getDaysInMonth(year, month);

  renderPrevMonthDays(daysContainer, jsDay, prevMonthDays);

  // Fetch events for current month
  getEvents(month, year).then((res) => {
    renderCurrentMonthDays(month, year, today, daysInMonth, res, daysContainer);

    renderDayEvents(daysContainer, eventsContainer, res, months);

    const totalCells = jsDay + daysInMonth;
    const nextMonthDays = 7 * Math.ceil(totalCells / 7) - totalCells;
    renderNextMonthDays(daysContainer, nextMonthDays);
  });
}

const updateCalendarHeader = (year, month) => {
  monthName.innerHTML = "";
  monthName.insertAdjacentHTML("beforeend", `<span>${month}</span>`);
  monthName.insertAdjacentHTML("beforeend", `<span>${year}</span>`);
};

yearBtnElm.addEventListener("click", () => {
  const inputValue = yearInputElm.value.trim();
  const year = parseInt(inputValue, 10);
  selectedDate = { ...selectedDate, year };
  console.log(inputValue);

  if (!/^\d{4}$/.test(inputValue) || year < 1900 || year > 2100) {
    console.log("if");

    yearErrorElm.textContent =
      ".لطفاً سال معتبر 4 رقمی بین 1900 تا 2100 وارد کنید";
    return;
  }

  yearErrorElm.textContent = "";
  yearInputElm.textContent = "";

  renderCalendar(parseInt(inputValue), selectedDate.month);

  updateCalendarHeader(selectedDate.year, months[selectedDate.month]);
});
