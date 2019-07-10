// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import OneLineEditor from '../../codemirror/one-line-editor';
import HelpTooltip from '../../help-tooltip';
import type { Request, RequestAuthentication } from '../../../../models/request';
import type { Settings } from '../../../../models/settings';

type Props = {
  request: Request,
  nunjucksPowerUserMode: boolean,
  showPasswords: boolean,
  isVariableUncovered: boolean,
  onChange: (Request, RequestAuthentication) => Promise<Request>,
  handleRender: string => Promise<string>,
  handleGetRenderContext: () => Promise<Object>,
  handleUpdateSettingsShowPasswords: boolean => Promise<Settings>,
};

@autobind
class RtsoftAuth extends React.PureComponent<Props> {
  _handleDisable() {
    const { request, onChange } = this.props;
    onChange(request, {
      ...request.authentication,
      disabled: !request.authentication.disabled,
    });
  }

  _handleChangeAccessKey(value: string) {
    const { request, onChange } = this.props;
    onChange(request, { ...request.authentication, accessKey: value });
  }

  _handleChangeSigningKey(value: string) {
    const { request, onChange } = this.props;
    onChange(request, { ...request.authentication, signingKey: value });
  }

  renderRow(key: string, label: string, onChange: Function, help?: string) {
    const {
      request,
      nunjucksPowerUserMode,
      handleRender,
      handleGetRenderContext,
      isVariableUncovered,
    } = this.props;

    return (
      <tr key={key}>
        <td className="pad-right no-wrap valign-middle">
          <label className="label--small no-pad">
            {label}
            {help ? <HelpTooltip>{help}</HelpTooltip> : null}
          </label>
        </td>
        <td className="wide">
          <div
            className={classnames('form-control form-control--underlined no-margin', {
              'form-control--inactive': request.authentication.disabled,
            })}>
            <OneLineEditor
              id={key}
              onChange={onChange}
              defaultValue={request.authentication[key] || ''}
              nunjucksPowerUserMode={nunjucksPowerUserMode}
              render={handleRender}
              getRenderContext={handleGetRenderContext}
              isVariableUncovered={isVariableUncovered}
            />
          </div>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <div className="pad">
        <table>
          <tbody>
            {this.renderRow('accessKey', 'Access Key', this._handleChangeAccessKey)}
            {this.renderRow('signingKey', 'Signing Key', this._handleChangeSigningKey)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default RtsoftAuth;
