<?php
require_once 'config.php';
require_once 'Event.php';
require_once 'month_day.php';
session_start();
?>

<!DOCTYPE html>
<html lang="fa">

<head>
    <meta charset="UTF-8">
    <title>Calendar</title>
    <link rel="stylesheet" href="./assets/css/style.css">
</head>

<body>
    <div class="container">
        <main>
            <section class="calendar">
                <section class="calendar__main">
                    <section class="calendar__add-event">

                        <button class="calendar__add-event-Btn">ADD EVENT</button>
                        <button class="calendar__go-today-Btn">TODAY</button>
                        <form class="calendar__add-event-form" method="POST" action="add_event.php">
                            <input type="number" name="day" min="1" max="31" placeholder="day..." required>

                            <select name="month" required>
                                <option value="" disabled selected hidden>months...</option>
                                <?php foreach ($months as $key => $month) { ?>
                                    <option value="<?= $key ?>"><?= $month ?></option>
                                <?php } ?>
                            </select>

                            <input type="number" name="year" placeholder="year...">

                            <input type="text" name="title" placeholder="title..." required>

                            <textarea name="description" placeholder="description..."></textarea>

                            <label>
                                <input type="checkbox" name="is_recurring"> Recurring every year
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

                                <div class="year__dropdown">
                                    <button class="year__dropdown-btn">go</button>
                                    <input class="year__dropdown-input" type="number" placeholder="سال را وارد کنید">
                                </div>

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
                                <button class="calendar__nav-btn--prev" aria-label="Previous Month">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                    </svg>
                                    <p>prev</p>
                                </button>

                                <button class="calendar__nav-btn--next" aria-label="Next Month">
                                    <p>next</p>
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
    <script type="module" src="./assets/js/app.js"></script>
</body>

</html>