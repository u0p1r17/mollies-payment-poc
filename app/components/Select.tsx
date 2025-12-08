"use client";

import React, { useState } from "react";

export default function Select({
  subject,
  onChange,
  valueOptions,
  fieldErrors
}: {
  subject: string;
  onChange: (value: string, subject: string) => void;
  valueOptions: string[];
  fieldErrors: string|undefined;
}) {
  const [selectedValue, setSelectedValue] = useState<string>("no_selection");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    onChange(e.target.value, subject);
  };

  const labelise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace("Id", "");
  };

  const displayOptions = valueOptions.map((option) => (
    <option key={option} value={option}>
      {labelise(subject)} {option}
    </option>
  ));

  if (displayOptions.length == 0) {
    return <></>;
  }

  return (
    <div>
      {fieldErrors && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {fieldErrors}
        </p>
      )}
      <label
        htmlFor={subject}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {labelise(subject)}
      </label>
      <select
        required
        name={subject}
        id={subject}
        onChange={(e) => handleChange(e)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
        // value={selectedValue ?? "no_selection"}
        defaultValue={"no_selection"}
      >
        <option value="no_selection" disabled>
          -- Sélectionner {labelise(subject)} --
        </option>
        {displayOptions}
      </select>
    </div>
  );
}
