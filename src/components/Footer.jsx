import React from 'react';
import { pageTitle } from '../constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className='text-center'>
      {pageTitle} &copy; {currentYear}. This project is licensed under the MIT License.
    </div>
  );
};