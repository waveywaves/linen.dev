import React from 'react';
import { SerializedAttachment } from '@linen/types';
import styles from './index.module.scss';
import { GoCloudDownload } from 'react-icons/go';

interface Props {
  attachment: SerializedAttachment;
}

function Attachment({ attachment }: Props) {
  return (
    <a
      className={styles.attachment}
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
    >
      <GoCloudDownload className={styles.icon} />
      {attachment.name}
    </a>
  );
}

export default Attachment;
