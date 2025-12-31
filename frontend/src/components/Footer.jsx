function Footer({ completedTasksCount = 0, activeTasksCount = 0 }) {
  return (
    <>
      {completedTasksCount + activeTasksCount > 0 && (
        <div className="text-center">
          <p className="text-sl text-slate-900">
            {" "}
            {completedTasksCount > 0 && (
              <>
                🎉Wondefull! You completed {completedTasksCount} task{" "}
                {activeTasksCount > 0 && `, remined ${activeTasksCount} task`}
              </>
            )}
            {completedTasksCount === 0 && activeTasksCount > 0 && (
              <>Let begin do {activeTasksCount} task</>
            )}
          </p>
        </div>
      )}
    </>
  );
}

export default Footer;
