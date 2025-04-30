
"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";

export default function CustomDatePicker({
  selected,
  onChange,
  startDate,
  endDate,
  selectsRange = false,
  placeholder = "Selecciona fecha",
  modo = "filtro"
}) {
  return (
    <DatePicker   
      selected={selected}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange={selectsRange}
      isClearable
      dateFormat="yyyy-MM-dd"
      placeholderText={placeholder}
      showPopperArrow={false}
      scrollableYearDropdown
      yearDropdownItemNumber={50}
      renderCustomHeader={({ date, changeYear, changeMonth }) => (
        <div className="datepicker-header">
          <select
            className="datepicker-select"
            value={date.getFullYear()}
            onChange={(e) => changeYear(+e.target.value)}
          >
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <select
            className="datepicker-select"
            value={date.getMonth()}
            onChange={(e) => changeMonth(+e.target.value)}
          >
            {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].map((month, i) => (
              <option key={month} value={i}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}
    />
  );
}
