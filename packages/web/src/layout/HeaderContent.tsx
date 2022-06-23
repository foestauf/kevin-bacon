import { Link } from 'react-router-dom';

export default function HeaderContent() {
  return (
    <>
      Header
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </>
  );
}
