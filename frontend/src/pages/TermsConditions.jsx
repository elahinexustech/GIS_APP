import React from 'react';

const TermsConditions = () => {
    return (
        <div className="container my-5">
            <div className="text-center mb-4">
                <h1 className="display-4">Legal</h1>
                <hr className="w-50 mx-auto" />
            </div>

            <section className="bg-light p-4 rounded shadow">
                <a href="/docs/docs.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-underline text-info"
                > <h2 className="mb-4 text-primary">Terms & Conditions</h2>
                </a>
            </section>
        </div>
    );
};

export default TermsConditions;
