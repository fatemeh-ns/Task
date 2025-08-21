export const $ = document;
export const monthToggle = $.querySelector(".calendar__month-toggle");
export const yearToggle = $.querySelector(".calendar__year-toggle");
export const monthDropdown = $.querySelector(".month__dropdown");
export const yearDropdown = $.querySelector(".year__dropdown");
export const monthName = $.querySelector(".calendar__header-month-name");
export const yearInputElm = $.querySelector(".year__dropdown-input");
export const yearBtnElm = $.querySelector(".year__dropdown-btn");
export const addEventForm = $.querySelector(".calendar__add-event-form");
export const addEventBtn = $.querySelector(".calendar__add-event-Btn");
export const goTodayBtn = $.querySelector(".calendar__go-today-Btn");
export const prevBtn = $.querySelector(".calendar__nav-btn--prev");
export const nextBtn = $.querySelector(".calendar__nav-btn--next");
export const monthItem = $.querySelectorAll(".month__list-item");
export const yearErrorElm = $.querySelector(".yearError");
export let daysContainer = $.querySelector(".calendar__days");
export let eventsContainer = $.querySelector(".calendar__events");

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
