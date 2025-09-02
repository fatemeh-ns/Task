<?php
require_once './backend/config.php';
require_once './backend/Event.php';
require_once './backend/month_day.php';

?>

<!DOCTYPE html>
<html lang="fa">

<head>
    <meta charset="UTF-8">
    <title>Calendar</title>
    <link rel="stylesheet" href="./frontend//assets//css//style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noty/3.2.0-beta/noty.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noty/3.2.0-beta/themes/mint.css" />

</head>

<body>
    <div class="container">

        <nav>
            <section class="nav_items">
                <button class="login_btn">ثبت نام</button>
            </section>
            <div class="nav__title">
                <h1>تقویم شمسی</h1>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                </svg>
            </div>
        </nav>
        <div class="login_box">
            <div class="login_content">
                <div class="login_content-header">
                    <svg class="login_box_close-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                    <h3>ثبت نام کنید</h3>
                </div>
                <div class="login_error"></div>
                <form class="login_form">
                    <input type="text" name="first_name" placeholder="نام" required>
                    <input type="text" name="last_name" placeholder="نام خانوادگی" required>
                    <input type="email" name="email" placeholder="ایمیل" required>
                    <input type="password" name="password" placeholder="رمز عبور" required>
                    <button type="submit">ثبت نام</button>
                    <p class="switch_to_signin">اگر ثبت نام کردید؟ <a href="#">وارد شوید</a></p>

                </form>

            </div>
        </div>

        <div class="signin_box">
            <div class="signin_content">
                <div class="signin_content-header">
                    <svg class="signin_box_close-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                    <h3>وارد شوید</h3>
                </div>
                <div class="signin_error"></div>
                <form class="signin_form">
                    <input type="email" name="email" placeholder="ایمیل" required>
                    <input type="password" name="password" placeholder="رمز عبور" required>
                    <button type="submit">ورود</button>
                    <p class="switch_to_login">ثبت نام نکردید؟ <a href="#">ثبت نام</a></p>
                </form>

            </div>
        </div>

        <main>
            <section class="calendar">
                <section class="calendar__main">
                    <section class="calendar__add-event">

                        <button class="calendar__add-event-Btn">ایجاد رویداد</button>
                        <button class="calendar__go-today-Btn">برو به امروز</button>
                        <form class="calendar__add-event-form">
                            <input type="number" name="day" min="1" max="31" placeholder="روز" required>

                            <select name="month" required>
                                <option value="" disabled selected hidden>ماه</option>
                                <?php foreach ($months as $key => $month) { ?>
                                    <option value="<?= $key ?>"><?= $month ?></option>
                                <?php } ?>
                            </select>

                            <input type="number" name="year" placeholder="سال">

                            <input type="text" name="title" placeholder="عنوان" required>

                            <textarea name="description" placeholder="توضیحات"></textarea>

                            <label>
                                <input type="checkbox" name="is_recurring"> برای هر سال
                            </label>

                            <button type="submit">ثبت</button>
                        </form>

                    </section>

                    <section class="calendar__calendar-wrapper">
                        <section class="calendar__header">
                            <section class="calendar__header-controls">

                                <button class="calendar__year-toggle" aria-label="Previous Year">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                <section class="year__dropdown">
                                    <div class="year__dropdown-input-box">
                                        <button class="year__dropdown-btn">برو</button>
                                        <input class="year__dropdown-input" type="number" placeholder="سال را وارد کنید">
                                    </div>
                                    <div class="yearError"></div>
                                </section>

                                <div class="calendar__header-month-name"></div>

                                <button class="calendar__month-toggle" aria-label="Next Months">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                    </svg>
                                </button>
                                <div class="month__dropdown">
                                    <label>ماه موردنظر خود را انتخاب کنید</label>
                                    <ul class="month__list">
                                        <?php foreach ($months as $key => $month) { ?>
                                            <li class="month__list-item" data-value="<?= $key ?>">
                                                <div class="month__list-icon"></div>
                                                <div class="month__list-title">
                                                    <?= $month ?>
                                                </div>
                                            </li>
                                        <?php } ?>
                                    </ul>
                                </div>
                            </section>
                            <section class="calendar__header-navigation">
                                <button class="calendar__nav-btn--next" aria-label="next Month">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                    </svg>
                                    <p>ماه بعد</p>
                                </button>

                                <button class="calendar__nav-btn--prev" aria-label="Previous Month">
                                    <p>ماه قبل</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </button>

                            </section>

                        </section>
                        <section class="calendar__body">
                            <div class="calendar__weekdays">
                                <?php foreach ($days as $day) { ?>
                                    <div><?= $day ?></div>
                                <?php } ?>
                            </div>
                            <div class="calendar__days">
                            </div>
                        </section>
                    </section>
                </section>
                <section class="calendar__events"></section>
            </section>
        </main>

    </div>
    <script src="node_modules/jalaali-js/dist/jalaali.min.js"></script>
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/noty/3.2.0-beta/noty.min.js"></script>
    <script src="./frontend/js/app.js"></script>
</body>

</html>