import React, { memo, useCallback, useMemo } from 'react';
import { FaYinYang, FaKeyboard } from 'react-icons/fa';
import { CogIcon, Button, Table, NumericalIcon, KeyIcon, FolderCloseIcon, DocumentIcon, TimeIcon, Checkbox, Select } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';

import CaptureFormatButton from './components/CaptureFormatButton';
import AutoExportToggler from './components/AutoExportToggler';
import useUserSettings from './hooks/useUserSettings';
import { askForFfPath } from './dialogs';
import { isMasBuild } from './util';


// https://www.electronjs.org/docs/api/locales
// See i18n.js
const langNames = {
  en: 'English',
  cs: 'Čeština',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  nl: 'Nederlands',
  nb: 'Norsk',
  pl: 'Polski',
  pt: 'Português',
  pt_BR: 'português do Brasil',
  fi: 'Suomi',
  ru: 'русский',
  // sr: 'Cрпски',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  ja: '日本語',
  zh: '中文',
  zh_Hant: '繁體中文',
  zh_Hans: '简体中文',
  ko: '한국어',
};

// eslint-disable-next-line react/jsx-props-no-spreading
const Row = (props) => <Table.Row height="auto" paddingY={12} {...props} />;
// eslint-disable-next-line react/jsx-props-no-spreading
const KeyCell = (props) => <Table.TextCell textProps={{ whiteSpace: 'auto' }} {...props} />;

const Settings = memo(({
  onTunerRequested,
  onKeyboardShortcutsDialogRequested,
}) => {
  const { t } = useTranslation();

  const { customOutDir, changeOutDir, keyframeCut, toggleKeyframeCut, timecodeFormat, setTimecodeFormat, invertCutSegments, setInvertCutSegments, askBeforeClose, setAskBeforeClose, enableAskForImportChapters, setEnableAskForImportChapters, enableAskForFileOpenAction, setEnableAskForFileOpenAction, autoSaveProjectFile, setAutoSaveProjectFile, invertTimelineScroll, setInvertTimelineScroll, language, setLanguage, ffmpegExperimental, setFfmpegExperimental, hideNotifications, setHideNotifications, autoLoadTimecode, setAutoLoadTimecode, enableTransferTimestamps, setEnableTransferTimestamps, enableAutoHtml5ify, setEnableAutoHtml5ify, customFfPath, setCustomFfPath, storeProjectInWorkingDir, setStoreProjectInWorkingDir, enableOverwriteOutput, setEnableOverwriteOutput } = useUserSettings();

  const onLangChange = useCallback((e) => {
    const { value } = e.target;
    const l = value !== '' ? value : undefined;
    setLanguage(l);
  }, [setLanguage]);

  const timecodeFormatOptions = useMemo(() => ({
    frameCount: t('Frame counts'),
    timecodeWithDecimalFraction: t('Millisecond fractions'),
    timecodeWithFramesFraction: t('Frame fractions'),
  }), [t]);

  const onTimecodeFormatClick = useCallback(() => {
    const keys = Object.keys(timecodeFormatOptions);
    let index = keys.indexOf(timecodeFormat);
    if (index === -1 || index >= keys.length - 1) index = 0;
    else index += 1;
    setTimecodeFormat(keys[index]);
  }, [setTimecodeFormat, timecodeFormat, timecodeFormatOptions]);

  const changeCustomFfPath = useCallback(async () => {
    const newCustomFfPath = await askForFfPath(customFfPath);
    setCustomFfPath(newCustomFfPath);
  }, [customFfPath, setCustomFfPath]);

  return (
    <>
      <Row>
        <KeyCell>App language</KeyCell>
        <Table.TextCell>
          <Select value={language || ''} onChange={onLangChange}>
            <option key="" value="">{t('System language')}</option>
            {Object.keys(langNames).map((lang) => <option key={lang} value={lang}>{langNames[lang]}</option>)}
          </Select>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Keyboard & mouse shortcuts')}</KeyCell>
        <Table.TextCell>
          <Button iconBefore={<FaKeyboard />} onClick={onKeyboardShortcutsDialogRequested}>{t('Keyboard & mouse shortcuts')}</Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Working directory')}<br />
          {t('This is where working files and exported files are stored.')}
        </KeyCell>
        <Table.TextCell>
          <Button iconBefore={customOutDir ? FolderCloseIcon : DocumentIcon} onClick={changeOutDir}>
            {customOutDir ? t('Custom working directory') : t('Same directory as input file')}...
          </Button>
          <div>{customOutDir}</div>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Auto save project file?')}<br />
        </KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Auto save project')}
            checked={autoSaveProjectFile}
            onChange={e => setAutoSaveProjectFile(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Store project file (.llc) in the working directory or next to loaded media file?')}</KeyCell>
        <Table.TextCell>
          <Button iconBefore={storeProjectInWorkingDir ? FolderCloseIcon : DocumentIcon} disabled={!autoSaveProjectFile} onClick={() => setStoreProjectInWorkingDir((v) => !v)}>
            {storeProjectInWorkingDir ? t('Store in working directory') : t('Store next to media file')}
          </Button>
        </Table.TextCell>
      </Row>

      {!isMasBuild && (
        <Row>
          <KeyCell>
            {t('Custom FFmpeg directory (experimental)')}<br />
            {t('This allows you to specify custom FFmpeg and FFprobe binaries to use. Make sure the "ffmpeg" and "ffprobe" executables exist in the same directory, and then select the directory.')}
          </KeyCell>
          <Table.TextCell>
            <Button iconBefore={CogIcon} onClick={changeCustomFfPath}>
              {customFfPath ? t('Using external ffmpeg') : t('Using built-in ffmpeg')}
            </Button>
            <div>{customFfPath}</div>
          </Table.TextCell>
        </Row>
      )}

      <Row>
        <KeyCell>{t('Set file modification date/time of output files to:')}</KeyCell>
        <Table.TextCell>
          <Button iconBefore={enableTransferTimestamps ? DocumentIcon : TimeIcon} onClick={() => setEnableTransferTimestamps((v) => !v)}>
            {enableTransferTimestamps ? t('Source file\'s time') : t('Current time')}
          </Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Keyframe cut mode')}<br />
          <b>{t('Keyframe cut')}</b>: {t('Cut at the nearest keyframe (not accurate time.) Equiv to')} <i>ffmpeg -ss -i ...</i><br />
          <b>{t('Normal cut')}</b>: {t('Accurate time but could leave an empty portion at the beginning of the video. Equiv to')} <i>ffmpeg -i -ss ...</i><br />
        </KeyCell>
        <Table.TextCell>
          <Button iconBefore={keyframeCut ? KeyIcon : undefined} onClick={() => toggleKeyframeCut()}>
            {keyframeCut ? t('Keyframe cut') : t('Normal cut')}
          </Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Choose cutting mode: Remove or keep selected segments from video when exporting?')}<br />
          <b>{t('Keep')}</b>: {t('The video inside segments will be kept, while the video outside will be discarded.')}<br />
          <b>{t('Remove')}</b>: {t('The video inside segments will be discarded, while the video surrounding them will be kept.')}
        </KeyCell>
        <Table.TextCell>
          <Button iconBefore={FaYinYang} appearance={invertCutSegments ? 'default' : 'primary'} intent="success" onClick={() => setInvertCutSegments((v) => !v)}>
            {invertCutSegments ? t('Remove') : t('Keep')}
          </Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Extract unprocessable tracks to separate files or discard them?')}<br />
          {t('(data tracks such as GoPro GPS, telemetry etc. are not copied over by default because ffmpeg cannot cut them, thus they will cause the media duration to stay the same after cutting video/audio)')}
        </KeyCell>
        <Table.TextCell>
          <AutoExportToggler />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Enable experimental ffmpeg features flag?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Experimental flag')}
            checked={ffmpegExperimental}
            onChange={e => setFfmpegExperimental(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>
          {t('Snapshot capture format')}
        </KeyCell>
        <Table.TextCell>
          <CaptureFormatButton showIcon />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('In timecode show')}</KeyCell>
        <Table.TextCell>
          <Button iconBefore={timecodeFormat === 'frameCount' ? NumericalIcon : TimeIcon} onClick={onTimecodeFormatClick}>
            {timecodeFormatOptions[timecodeFormat]}
          </Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Timeline trackpad/wheel sensitivity')}</KeyCell>
        <Table.TextCell>
          <Button onClick={() => onTunerRequested('wheelSensitivity')}>{t('Change value')}</Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Timeline keyboard seek speed')}</KeyCell>
        <Table.TextCell>
          <Button onClick={() => onTunerRequested('keyboardNormalSeekSpeed')}>{t('Change value')}</Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Timeline keyboard seek acceleration')}</KeyCell>
        <Table.TextCell>
          <Button onClick={() => onTunerRequested('keyboardSeekAccFactor')}>{t('Change value')}</Button>
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Invert timeline trackpad/wheel direction?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Invert direction')}
            checked={invertTimelineScroll}
            onChange={e => setInvertTimelineScroll(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Ask for confirmation when closing app or file?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Ask before closing')}
            checked={askBeforeClose}
            onChange={e => setAskBeforeClose(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Ask about importing chapters from opened file?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Ask about chapters')}
            checked={enableAskForImportChapters}
            onChange={e => setEnableAskForImportChapters(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Overwrite files when exporting, if a file with the same name as the output file name exists?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Overwrite existing files')}
            checked={enableOverwriteOutput}
            onChange={e => setEnableOverwriteOutput(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Auto load timecode from file as an offset in the timeline?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Auto load timecode')}
            checked={autoLoadTimecode}
            onChange={e => setAutoLoadTimecode(e.target.checked)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Try to automatically convert to supported format when opening unsupported file?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Auto convert to supported format')}
            checked={enableAutoHtml5ify}
            onChange={e => setEnableAutoHtml5ify(e.target.checked)}
          />
        </Table.TextCell>
      </Row>


      <Row>
        <KeyCell>{t('Hide informational notifications?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Check to hide notifications')}
            checked={!!hideNotifications}
            onChange={e => setHideNotifications(e.target.checked ? 'all' : undefined)}
          />
        </Table.TextCell>
      </Row>

      <Row>
        <KeyCell>{t('Ask about what to do when opening a new file when another file is already already open?')}</KeyCell>
        <Table.TextCell>
          <Checkbox
            label={t('Ask on file open')}
            checked={enableAskForFileOpenAction}
            onChange={e => setEnableAskForFileOpenAction(e.target.checked)}
          />
        </Table.TextCell>
      </Row>
    </>
  );
});

export default Settings;
