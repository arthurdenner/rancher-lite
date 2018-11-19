import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import Button from "../components/Button";
import Info from "../components/Info";
import {
  actions,
  getSelectedStack,
  getSelectedService,
  getApi
} from "../store";

function getImage(service) {
  const imageUuid = get(
    service,
    "upgrade.inServiceStrategy.launchConfig.imageUuid",
    ""
  );

  return imageUuid.replace(/^docker:/, "");
}

function getTag(service) {
  const imageUuid = get(
    service,
    "upgrade.inServiceStrategy.launchConfig.imageUuid",
    ""
  );

  if (!imageUuid) return "";

  const regex = /(^docker:)(.*):(.*)/;

  if (imageUuid.match(regex)) {
    return imageUuid.replace(regex, "$3");
  }

  return "latest";
}

class Service extends Component {
  handleRestart = () => {
    this.props.restart();
  };

  render() {
    const { service, selectService } = this.props;
    const image = getImage(service);

    return (
      <div>
        <section className="header">
          <h1>
            <a href="#" onClick={() => selectService(null)}>
              Service:{" "}
            </a>
            <span style={{ fontSize: 15 }}>{service.name}</span>
          </h1>
        </section>
        <section>
          {!!image && (
            <React.Fragment>
              <Info label="Image:" value={image} />
              <hr />
              <Info label="Tag:" value={getTag(service)} />
              <hr />
            </React.Fragment>
          )}
          <Info label="Type:" value={service.type} />
        </section>
        <div className="footer-actions">
          {!!service.actions.restart && (
            <Button content="Restart" onClick={this.handleRestart} />
          )}
          {/*<Button type="button" link content="Cancel" />*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const stack = getSelectedStack(state);
  const service = getSelectedService(state);

  return {
    stack,
    service,
    restart: () =>
      getApi(state).post(
        `projects/${state.selectedProject}/services/${
          service.id
        }?action=restart`
      )
  };
};

const mapDispatchToProps = {
  setServices: actions.setServices,
  selectService: actions.selectService,
  showLoader: actions.showLoader,
  hideLoader: actions.hideLoader
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Service);
