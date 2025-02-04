import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

interface Props {
  value: string;
}

function Mail({ value }: Props) {
  const [href, name] = value.split('|');
  return (
    <a
      className={classNames('text-indigo-700', styles.link)}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {name || href.split(':')[1]}
    </a>
  );
}

export default Mail;
