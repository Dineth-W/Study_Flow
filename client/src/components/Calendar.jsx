import React from "react";

function Calendar({
  events, currentMonth, goToPreviousMonth, goToNextMonth, goToToday,
  getCalendarDays, formatDateKey, getEventsForDate, selectedDate,
  setSelectedDate, formatDisplayDate, formatTime, handleEditEvent,
  handleDeleteEvent
}) {
  return (
<section className="section calendar-section">

          <div className="section-title">

              <div>
                  <h2>Calendar</h2>

                  <p>
                      Your schedule and upcoming events
                  </p>
              </div>

          </div>

    <div className="calendar-card">

        {/* CALENDAR HEADER */}

        <div className="calendar-header">

            <button
                className="calendar-nav-button"
                onClick={goToPreviousMonth}
            >
                ←
            </button>

            <h2>
                {currentMonth.toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric"
                    }
                )}
            </h2>

            <button
                className="calendar-nav-button"
                onClick={goToNextMonth}
            >
                →
            </button>

        </div>

        <button
            className="calendar-today-button"
            onClick={goToToday}
        >
            Today
        </button>

        {/* WEEK DAYS */}

        <div className="calendar-weekdays">

            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>

        </div>

        {/* CALENDAR DAYS */}

        <div className="calendar-grid">

            {getCalendarDays().map((date, index) => {

                if (!date) {
                    return (
                        <div
                            className="calendar-day empty"
                            key={`empty-${index}`}
                        ></div>
                    );
                }

                const dateKey = formatDateKey(date);

                const dayEvents =
                    getEventsForDate(date);

                const todayKey =
                    formatDateKey(new Date());

                const isToday =
                    dateKey === todayKey;

                const isSelected =
                    selectedDate === dateKey;

                return (

                    <button
                        className={`calendar-day ${
                            isToday ? "today" : ""
                        } ${
                            isSelected ? "selected" : ""
                        }`}
                        key={dateKey}
                        onClick={() =>
                            setSelectedDate(dateKey)
                        }
                    >

                        <span className="calendar-day-number">
                            {date.getDate()}
                        </span>

                        <div className="calendar-day-events">

                            {dayEvents.map((event) => (

                                <div
                                    className="calendar-event-title"
                                    key={event._id}
                                >
                                    {event.title}
                                </div>

                            ))}

                        </div>

                    </button>

                );
            })}

        </div>

        {/* SELECTED DATE DETAILS */}

        {selectedDate && (

            <div className="event-details">

                <div className="event-details-header">

                    <h3>
                        {formatDisplayDate(selectedDate)}
                    </h3>

                    <button
                        onClick={() =>
                            setSelectedDate(null)
                        }
                    >
                        Close
                    </button>

                </div>

                {events.filter(
                    (event) =>
                        event.date.slice(0, 10) ===
                        selectedDate
                ).length === 0 ? (

                    <p>
                        No events scheduled for this date.
                    </p>

                ) : (

                    events
                        .filter(
                            (event) =>
                                event.date.slice(0, 10) ===
                                selectedDate
                        )
                        .sort(
                            (a, b) =>
                                a.startTime.localeCompare(
                                    b.startTime
                                )
                        )
                        .map((event) => (

                            <div
                                className="event-detail-card"
                                key={event._id}
                            >

                                <h3>
                                    {event.title}
                                </h3>

                                <p>
                                    <strong>
                                        Subject:
                                    </strong>{" "}
                                    {event.subject ||
                                        "Not specified"}
                                </p>

                                <p>
                                    <strong>
                                        Time:
                                    </strong>{" "}
                                    {formatTime(
                                        event.startTime
                                    )}
                                    {" - "}
                                    {formatTime(
                                        event.endTime
                                    )}
                                </p>

                                <p>
                                    <strong>
                                        Location:
                                    </strong>{" "}
                                    {event.location ||
                                        "Not specified"}
                                </p>

                                <p>
                                    <strong>
                                        Type:
                                    </strong>{" "}
                                    {event.type}
                                </p>

                                <div className="event-card-actions">
                                    <button
                                        type="button"
                                        className="edit-event-button"
                                        onClick={() => handleEditEvent(event)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-event-button"
                                        onClick={() => handleDeleteEvent(event._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                            </div>

                        ))

                )}

            </div>

        )}

    </div>

</section>
  );
}

export default Calendar;
