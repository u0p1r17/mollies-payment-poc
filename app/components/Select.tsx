"use client";

import React from "react";

export default function Select({
  subject,
  onChange,
  valueOptions,
  fieldErrors,
  value,
  onBlur,
  touched = false
}: {
  subject: string;
  onChange: (value: string, subject: string) => void;
  valueOptions: string[];
  fieldErrors?: string;
  value?: string;
  onBlur?: (value: string, subject: string) => void;
  touched?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value, subject);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (onBlur) {
      onBlur(e.target.value, subject);
    }
  };

  const labelise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace("Id", "");
  };

  // Générer les classes CSS conditionnelles
  const getSelectClassName = () => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition";
    const hasError = touched && fieldErrors;
    const isValid = touched && !fieldErrors && value && value !== "";

    if (hasError) {
      return `${baseClasses} border-red-500 dark:border-red-400 focus:ring-red-500`;
    }
    if (isValid) {
      return `${baseClasses} border-green-500 dark:border-green-400 focus:ring-green-500`;
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 focus:ring-blue-500`;
  };

  const displayOptions = valueOptions.map((option) => (
    <option key={option} value={option}>
      {labelise(subject)} {option}
    </option>
  ));

  if (displayOptions.length === 0) {
    return <></>;
  }

  return (
    <div>
      <label
        htmlFor={subject}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {labelise(subject)}
      </label>
      <select
        name={subject}
        id={subject}
        onChange={handleChange}
        onBlur={handleBlur}
        className={getSelectClassName()}
        value={value ?? ""}
      >
        <option value="" disabled>
          Make your selection
        </option>
        {displayOptions}
      </select>
      {fieldErrors && touched && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {fieldErrors}
        </p>
      )}
    </div>
  );
}
