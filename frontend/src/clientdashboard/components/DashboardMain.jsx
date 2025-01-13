import React from "react";

export const DashboardMain = () => {
  return (
    <>
      <main style={{ marginTop: 58 }}>
        <div className="container pt-4">
          {/* Section: User Statistics */}

          <section>
          <div className="row">
            {/* Total Users by Classification */}
            <div className="col-xl-4 col-sm-6 col-12 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between px-md-1">
                    <div className="align-self-center">
                      <i className="fas fa-users text-info fa-3x" />
                    </div>
                    <div className="text-end">
                      <p className="mb-0">Total Users</p>
                      <p className="mb-0">Buyers: 800</p>
                      <p className="mb-0">Sellers: 400</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>




            {/* Activity of Users (Buyers) */}
            <div className="col-xl-4 col-sm-6 col-12 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between px-md-1">
                    <div className="align-self-center">
                      <i className="fas fa-chart-line text-success fa-3x" />
                    </div>
                    <div className="text-end">
                      <p className="mb-0">Active Buyers</p>
                      <p className="mb-0">Transactions Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Count of Comments */}
            <div className="col-xl-4 col-sm-6 col-12 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between px-md-1">
                    <div className="align-self-center">
                      <i className="far fa-comment-alt text-warning fa-3x" />
                    </div>
                    <div className="text-end">
                      <p className="mb-0">Total Comments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </section>
        </div>
      </main>
    </>
  );
};














