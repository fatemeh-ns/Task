const $monthToggle = $(".calendar__month-toggle");
const $monthDropdown = $(".month__dropdown");
const $yearToggle = $(".calendar__year-toggle");
const $yearDropdown = $(".year__dropdown");
const $monthName = $(".calendar__header-month-name");
const $yearInputElm = $(".year__dropdown-input");
const $yearBtnElm = $(".year__dropdown-btn");
const $addEventForm = $(".calendar__add-event-form");
const $addEventBtn = $(".calendar__add-event-Btn");
const $goTodayBtn = $(".calendar__go-today-Btn");
const $prevBtn = $(".calendar__nav-btn--prev");
const $nextBtn = $(".calendar__nav-btn--next");
const $monthItem = $(".month__list-item");
const $yearErrorElm = $(".yearError");
const $daysContainer = $(".calendar__days");
const $eventsContainer = $(".calendar__events");
const $loginBtn = $(".login_btn");
const $loginBox = $(".login_box");
const $loginBoxCloseBtn = $(".login_box_close-btn");
const $signinBoxCloseBtn = $(".signin_box_close-btn");
const $loginForm = $(".login_form");
const $signinForm = $(".signin_form");
const $loginErrorElm = $(".login_error");
const $signinErrorElm = $(".signin_error");
const $signinBox = $(".signin_box");
const $nav = $("nav");

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function getDaysInMonth(year, month) {
  if (month <= 5) return 31;
  if (month <= 10) return 30;

  return jalaali.isLeapJalaaliYear(year) ? 30 : 29;
}

function getEvents(month, year) {
  let token = localStorage.getItem("auth_token");
  return $.ajax({
    url: "/Task/backend/get_events.php",
    method: "POST",
    data: JSON.stringify({ month: month + 1, year, token }),
    contentType: "application/json",
    dataType: "json",
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.error("خطا در ارسال:", textStatus, errorThrown);
  });
}

const today = new Date();
const jToday = jalaali.toJalaali(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

let selectedDate = { year: jToday.jy, month: jToday.jm };

$(function () {
  // Init calendar on page load
  renderCalendar(jToday.jy, jToday.jm);

  const updateCalendarHeader = (year, month) => {
    $monthName.html(`<span>${month}</span><span>${year}</span>`);
  };

  updateCalendarHeader(jToday.jy, months[jToday.jm]);

  $monthItem.each(function (index) {
    // Handle month change
    $(this).on("click", function (e) {
      e.stopPropagation();
      renderCalendar(selectedDate.year, index);
      updateCalendarHeader(selectedDate.year, months[index]);
      selectedDate = { ...selectedDate, month: index };
    });
  });

  $monthToggle.on("click", function () {
    $monthDropdown.toggleClass("active");
  });

  $yearToggle.on("click", function () {
    $yearDropdown.toggleClass("active");
  });

  $addEventBtn.on("click", function () {
    let token = localStorage.getItem("auth_token");
    if (token) {
      $addEventForm.toggleClass("active");
    } else {
      new Noty({
        type: "error",
        layout: "topCenter",
        text: "ابتدا باید ثبت نام کنید",
        timeout: 1000,
      }).show();
    }
  });

  $loginBtn.on("click", function () {
    if ($signinBox.hasClass("active")) {
      $signinBox.removeClass("active");
      $loginBox.addClass("active");
    }

    $loginBox.toggleClass("active");
  });

  $loginBoxCloseBtn.on("click", function () {
    $loginBox.removeClass("active");
  });

  $signinBoxCloseBtn.on("click", function () {
    $signinBox.removeClass("active");
  });

  $goTodayBtn.on("click", function () {
    if (
      selectedDate.month === jToday.jm - 1 &&
      selectedDate.year === jToday.jy
    ) {
      return;
    }

    selectedDate = { year: jToday.jy, month: jToday.jm };
    renderCalendar(selectedDate.year, selectedDate.month);
    updateCalendarHeader(selectedDate.year, months[selectedDate.month]);
  });

  $prevBtn.on("click", function () {
    let year = selectedDate.year;
    let month = selectedDate.month - 1;

    if (month < 0) {
      month = 11;
      year -= 1;
    }

    selectedDate = { ...selectedDate, year, month };
    renderCalendar(year, month);
    updateCalendarHeader(year, months[month]);
  });

  $nextBtn.on("click", function () {
    let year = selectedDate.year;
    let month = selectedDate.month + 1;

    if (month > 11) {
      month = 0;
      year += 1;
    }

    selectedDate = { ...selectedDate, year, month };
    renderCalendar(year, month);
    updateCalendarHeader(year, months[month]);
  });

  function renderPrevMonthDays($daysContainer, firstDayInMonth, prevMonthDays) {
    for (let i = 0; i < firstDayInMonth; i++) {
      $daysContainer.append(
        `<div class="prev_month_days">${prevMonthDays - i}</div>`
      );
    }
  }

  function renderCurrentMonthDays(
    month,
    year,
    daysInMonth,
    res,
    $daysContainer
  ) {
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        d === jToday.jd && month === jToday.jm && year === jToday.jy;

      const hasEvent = res.some((event) => event.day === d);
      const isHoliday = res.some(
        (event) => event.day === d && event.is_holiday === 1
      );

      const classes = ["current_month_days"];
      if (isToday) classes.push("today");
      if (hasEvent) classes.push("has-event");
      if (isHoliday) classes.push("holiday");

      $daysContainer.append(`<div class="${classes.join(" ")}">${d}</div>`);
    }
  }

  function renderNextMonthDays($daysContainer, nextMonthDays) {
    for (let i = 0; i < nextMonthDays; i++) {
      $daysContainer.append(`<div class="next_month_days">${i + 1}</div>`);
    }
  }

  function renderDayEvents($daysContainer, $eventsContainer, res, months) {
    $daysContainer.on("click", (e) => {
      if ($(e.target).hasClass("has-event")) {
        $eventsContainer.addClass("active");
        const dayClicked = parseInt($(e.target).text());
        const eventsForDay = res.filter(
          (event) => parseInt(event.day) === dayClicked
        );

        $eventsContainer.html("");

        eventsForDay.forEach((ev) => {
          $eventsContainer.append(
            `
             <div class="calendar__event-header">
              <h2>${ev.title} :</h2>
              <h2>${ev.day} / ${ev.month}</h2>
              </div>
              <p>${ev.description}</p>
             `
          );
        });
      }
    });
  }

  // Render full calendar (prev, current, next month days + events)
  function renderCalendar(year, month) {
    $eventsContainer.html("");

    $monthDropdown.removeClass("active");
    $yearDropdown.removeClass("active");
    $daysContainer.html("");

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

    const { gy, gm, gd } = jalaali.toGregorian(year, month + 1, 1);
    const firstDay = new Date(gy, gm - 1, gd).getDay();
    let firstDayInMonth = (firstDay + 1) % 7;

    let daysInMonth = getDaysInMonth(year, month);

    renderPrevMonthDays($daysContainer, firstDayInMonth, prevMonthDays);

    // Fetch events for current month
    getEvents(month, year).then((res) => {
      renderCurrentMonthDays(month, year, daysInMonth, res, $daysContainer);

      renderDayEvents($daysContainer, $eventsContainer, res, months);

      const totalCells = firstDayInMonth + daysInMonth;
      const nextMonthDays = 7 * Math.ceil(totalCells / 7) - totalCells;
      renderNextMonthDays($daysContainer, nextMonthDays);
    });
  }

  $yearBtnElm.on("click", function () {
    const inputValue = $yearInputElm.val().trim();
    const year = parseInt(inputValue, 10);
    selectedDate = { ...selectedDate, year };

    if (!/^\d{4}$/.test(inputValue) || year < 1300 || year > 1500) {
      $yearErrorElm.text(".لطفاً سال معتبر 4 رقمی بین 1300 تا 1500 وارد کنید");
      return;
    }

    $yearErrorElm.text("");
    $yearInputElm.val("");

    renderCalendar(year, selectedDate.month);
    updateCalendarHeader(selectedDate.year, months[selectedDate.month]);
  });

  $addEventForm.on("submit", function (e) {
    e.preventDefault();
    const jsonData = {
      token: localStorage.getItem("auth_token"),
    };
    $(this)
      .serializeArray()
      .forEach((field) => {
        jsonData[field.name] = field.value;
      });
    if (!jsonData.year) {
      jsonData.year = jToday.jy;
    }

    $.ajax({
      url: "/Task/backend/add_event.php",
      method: "POST",
      data: JSON.stringify(jsonData),
      contentType: "application/json",
      dataType: "json",
    })
      .done(function (data) {
        if (data && data.status === "ok") {
          const month = parseInt(jsonData.month, 10);
          const year = parseInt(jsonData.year, 10);
          renderCalendar(year, month);
          updateCalendarHeader(year, months[month]);
          $addEventForm.removeClass("active");
          $addEventForm[0].reset();
          new Noty({
            type: "success",
            layout: "topCenter",
            text: "رویداد شما اضافه شد",
            timeout: 1000,
          }).show();
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("خطا در ارسال:", textStatus, errorThrown);
      });
  });

  $loginForm.on("submit", function (e) {
    e.preventDefault();

    const jsonData = {};
    $(this)
      .serializeArray()
      .forEach((field) => {
        jsonData[field.name] = field.value;
      });

    if (!/^\d{6}$/.test(jsonData.password)) {
      $loginErrorElm.text("رمز عبور باید 6 رقم عدد باشد");
      return;
    }

    $.ajax({
      url: "/Task/backend/login.php",
      method: "POST",
      data: JSON.stringify(jsonData),
      contentType: "application/json",
      dataType: "json",
    })

      .done(function (data) {
        if (data && data.status === "ok") {
          localStorage.setItem("auth_token", data.token);
          $loginBox.removeClass("active");
          $loginForm[0].reset();
          $loginBtn.css("display", "none");
          $(".nav_items").prepend(`
            <button class="logout_btn">خروج از حساب کاربری</button>
            <div class="user_info">
            <span>${data.userInfo.first_name} ${data.userInfo.last_name}</span>
            <svg class="user_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            </div>
            `);
          new Noty({
            type: "success",
            layout: "topCenter",
            text: "ثبت نام شما با موفقیت انجام شد",
            timeout: 1000,
          }).show();
        } else if (data && data.status === "error") {
          new Noty({
            type: "error",
            layout: "topCenter",
            text: data.message,
            timeout: 1000,
          }).show();
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("خطا در ارسال:", textStatus, errorThrown);
      });
  });

  $signinForm.on("submit", function (e) {
    e.preventDefault();

    const jsonData = {};
    $(this)
      .serializeArray()
      .forEach((field) => {
        jsonData[field.name] = field.value;
      });
    if (!/^\d{6}$/.test(jsonData.password)) {
      $signinErrorElm.text("رمز عبور باید 6 رقم عدد باشد");
      return;
    }

    $.ajax({
      url: "/Task/backend/signin.php",
      method: "POST",
      data: JSON.stringify(jsonData),
      contentType: "application/json",
      dataType: "json",
    })

      .done(function (data) {
        if (data && data.status === "ok") {
          localStorage.setItem("auth_token", data.token);
          $signinBox.removeClass("active");
          $signinForm[0].reset();
          $loginBtn.css("display", "none");
          $(".nav_items").prepend(`
            <button class="logout_btn">خروج از حساب کاربری</button>
            <div class="user_info">
            <span>${data.userInfo.first_name} ${data.userInfo.last_name}</span>
            <svg class="user_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            </div>
            `);
          new Noty({
            type: "success",
            layout: "topCenter",
            text: "ورود شما با موفقیت انجام شد",
            timeout: 1000,
          }).show();
        } else if (data && data.status === "error") {
          new Noty({
            type: "error",
            layout: "topCenter",
            text: data.message,
            timeout: 1000,
          }).show();
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("خطا در ارسال:", textStatus, errorThrown);
      });
  });

  let token = localStorage.getItem("auth_token");
  if (token) {
    $.ajax({
      url: "/Task/backend/check_token.php",
      method: "POST",
      data: JSON.stringify({ token: token }),
      contentType: "application/json",
      dataType: "json",
    })

      .done(function (data) {
        $loginBtn.css("display", "none");
        $(".nav_items").prepend(`
            <button class="logout_btn">خروج از حساب کاربری</button>
            <div class="user_info">
            <span>${data.userInfo.first_name} ${data.userInfo.last_name}</span>
            <svg class="user_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            </div>
            `);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("خطا در ارسال:", textStatus, errorThrown);
      });
  }

  $(".nav_items").on("click", ".logout_btn", function () {
    $.ajax({
      url: "/Task/backend/logout.php",
      method: "POST",
      data: JSON.stringify({ token: localStorage.getItem("auth_token") }),
      contentType: "application/json",
      dataType: "json",
    })
      .done(function () {
        localStorage.removeItem("auth_token");

        $(".nav_items .logout_btn").remove();
        $(".nav_items .user_info").remove();

        $loginBtn.css("display", "block");
        renderCalendar(jToday.jy, jToday.jm);
        console.log(jToday.jm);

        updateCalendarHeader(jToday.jy, months[jToday.jm]);
        new Noty({
          type: "success",
          layout: "topCenter",
          text: "از حساب خود خارج شدید",
          timeout: 1000,
        }).show();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("خطا در ارسال:", textStatus, errorThrown);
      });
  });

  $(".switch_to_signin a").on("click", function (e) {
    e.preventDefault();
    $loginBox.removeClass("active");
    $signinBox.addClass("active");
  });

  $(".switch_to_login a").on("click", function (e) {
    e.preventDefault();
    $signinBox.removeClass("active");
    $loginBox.addClass("active");
  });
});
