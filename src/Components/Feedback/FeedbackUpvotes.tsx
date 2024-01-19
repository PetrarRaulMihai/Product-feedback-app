function FeedbackUpvotes({ children, incrementFunction }: any) {
  return (
    <>
      <button type="button" onClick={incrementFunction} className="font-bold">
        {children}
      </button>
    </>
  );
}

export default FeedbackUpvotes;
