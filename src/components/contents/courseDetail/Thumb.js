import React from "react";

export default class Thumb extends React.Component {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.curriculum) { return; }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.curriculum);
    });
  }

  render() {
    const { curriculum } = this.props;
    const { loading, thumb } = this.state;

    if (!curriculum) { return null; }

    if (loading) { return <p>loading...</p>; }

    return (<img src={thumb}
      alt={curriculum.name}
      className="img-thumbnail mt-2"
      height={200}
      width={200} />);
  }
}
