const mockNavigate = jest.fn();

module.exports = {
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
};

export {};
