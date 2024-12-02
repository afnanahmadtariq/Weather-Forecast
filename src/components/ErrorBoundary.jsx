/* eslint-disable no-undef */
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p>Please try refreshing the page or try again later.</p>
        </Alert>
      );
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

export default ErrorBoundary;