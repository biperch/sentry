// eslint-disable-next-line simple-import-sort/imports
import React from 'react';
import styled from '@emotion/styled';
import cloneDeep from 'lodash/cloneDeep';

import AsyncComponent from 'app/components/asyncComponent';
import {IntegrationWithConfig, Organization, ServerlessFunction} from 'app/types';
import {Panel, PanelBody, PanelHeader} from 'app/components/panels';
import space from 'app/styles/space';
import Alert from 'app/components/alert';
import withOrganization from 'app/utils/withOrganization';
import {t} from 'app/locale';
import {trackIntegrationEvent} from 'app/utils/integrationUtil';

import IntegrationServerlessRow from './integrationServerlessRow';

type Props = AsyncComponent['props'] & {
  integration: IntegrationWithConfig;
  organization: Organization;
};

type State = AsyncComponent['state'] & {
  serverlessFunctions: ServerlessFunction[];
};

class IntegrationServerlessFunctions extends AsyncComponent<Props, State> {
  getDefaultState(): State {
    return {
      ...super.getDefaultState(),
      serverlessFunctions: [],
    };
  }

  getEndpoints(): ReturnType<AsyncComponent['getEndpoints']> {
    const orgSlug = this.props.organization.slug;
    return [
      [
        'serverlessFunctions',
        `/organizations/${orgSlug}/integrations/${this.props.integration.id}/serverless-functions/`,
      ],
    ];
  }

  get serverlessFunctions() {
    return this.state.serverlessFunctions;
  }

  onLoadAllEndpointsSuccess() {
    trackIntegrationEvent(
      {
        eventKey: 'integrations.serverless_functions_viewed',
        eventName: 'Integrations: Serverless Functions Viewed',
        integration: this.props.integration.provider.key,
        integration_type: 'first_party',
        num_functions: this.serverlessFunctions.length,
      },
      this.props.organization
    );
  }

  handleFunctionUpdate = (serverlessFunction: ServerlessFunction, index: number) => {
    const serverlessFunctions = cloneDeep(this.serverlessFunctions);
    serverlessFunctions[index] = serverlessFunction;
    this.setState({serverlessFunctions});
  };

  renderBody() {
    return (
      <React.Fragment>
        <Alert type="info">
          {t(
            'Manage your AWS Lambda functions below. Only Node runtimes are currently supported.'
          )}
        </Alert>
        <Panel>
          <StyledPanelHeader disablePadding hasButtons>
            <NameHeader>{t('Name')}</NameHeader>
            <RuntimeHeader>{t('Runtime')}</RuntimeHeader>
            <VersionHeader>{t('Version')}</VersionHeader>
            <EnableHeader>{t('Enabled')}</EnableHeader>
            <UpdateHeader>{t('Update')}</UpdateHeader>
          </StyledPanelHeader>
          <StyledPanelBody>
            {this.serverlessFunctions.map((serverlessFunction, i) => (
              <IntegrationServerlessRow
                key={serverlessFunction.name}
                serverlessFunction={serverlessFunction}
                onUpdateFunction={(response: ServerlessFunction) =>
                  this.handleFunctionUpdate(response, i)
                }
                {...this.props}
              />
            ))}
          </StyledPanelBody>
        </Panel>
      </React.Fragment>
    );
  }
}

export default withOrganization(IntegrationServerlessFunctions);

const StyledPanelHeader = styled(PanelHeader)`
  display: grid;
  grid-column-gap: ${space(1)};
  align-items: center;
  grid-template-columns: 2fr 1fr 0.5fr 0.25fr 0.5fr;
  grid-template-areas: 'function-name runtime version enable-switch update-button';
`;

const HeaderText = styled('div')`
  padding-left: ${space(2)};
  flex: 1;
`;

const StyledPanelBody = styled(PanelBody)``;

const NameHeader = styled(HeaderText)`
  grid-area: function-name;
`;

const RuntimeHeader = styled(HeaderText)`
  grid-area: runtime;
`;

const VersionHeader = styled(HeaderText)`
  grid-area: version;
`;

const EnableHeader = styled(HeaderText)`
  grid-area: enable-switch;
`;

const UpdateHeader = styled(HeaderText)`
  grid-area: update-button;
`;
