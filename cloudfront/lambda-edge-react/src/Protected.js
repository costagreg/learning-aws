import React, { Component } from "react";

class Protected extends Component {
  render() {
    return (
      <div>
        <h1>Secure Zone</h1>

        <p>Protected content.</p>
      </div>
    );
  }
}

export default Protected;
