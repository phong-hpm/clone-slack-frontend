const mockUseNavigate = jest.fn();

module.exports = {
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
};

export {};
