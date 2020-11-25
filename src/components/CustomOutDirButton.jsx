import React, { memo } from 'react';
import { Button } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';

import { withBlur } from '../util';


const CustomOutDirButton = memo(({ customOutDir, changeOutDir }) => {
  const { t } = useTranslation();

  return (
    <Button
      iconBefore={customOutDir ? 'folder-open' : undefined}
      height={20}
      onClick={withBlur(changeOutDir)}
      title={customOutDir}
    >
      {customOutDir ? t('Working dir set') : t('Working dir unset')}
    </Button>
  );
});

export default CustomOutDirButton;
