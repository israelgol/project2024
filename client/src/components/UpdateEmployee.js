import { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../App";
import DeleteWarning from "./DeleteWarning";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UpdateEmployee = ({ setCurrentPage }) => {
    const employeeId = useContext(EmployeeContext);
    const [isLoading, setIsLoading] = useState(true);
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        hrPermission: false
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showDeleteBox, setShowDeleteBox] = useState(false);

    useEffect(() => {
        const getEmployee = async () => {
            try {
                const response = await fetch(`${backendUrl}/hr/employee?employeeIdtoUpdate=${employeeId}`, {
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                })
                const { fetchedEmployee } = await response.json();
                console.log('fetched employee:', fetchedEmployee)
                setEmployee(prevData => ({
                    ...prevData,
                    ...fetchedEmployee,
                    hrPermission: fetchedEmployee.role === 'HR'
                }));
                setIsLoading(false);
            } catch (error) {
                console.error('Fetching employee data failed:', error);
                alert('Failed to load employee data');
                setIsLoading(false);
            }
        }
        getEmployee();
    }, [employeeId])

    const handleChange = (e) => {
        const { type, name, value, checked } = e.target;
        setEmployee(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (showPasswordFields && passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const updatedEmployee = {
                ...employee,
                password: showPasswordFields ? passwordData.newPassword : employee.password
            };
            const result = await fetch(`${backendUrl}/hr/update`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: updatedEmployee.firstName,
                    lastName: updatedEmployee.lastName,
                    email: updatedEmployee.email,
                    password: updatedEmployee.password,
                    isHr: updatedEmployee.hrPermission,
                    employeeId: employeeId
                })
            })
            if (result.ok) {
                alert('Account updated!');
                setCurrentPage('Employees');
            }
        } catch {
            alert('Error registering employee');
        }
    }

    if (isLoading || !employee) {
        return <p>Loading employee data...</p>;
    }

    return (
        <div>
            <h2>Update employee</h2>
            <form onSubmit={handleSubmit}>
                <label>First name:</label>
                <input type="text" name="firstName" value={employee.firstName}
                    onChange={handleChange}
                    required />

                <label>Last name:</label>
                <input type="text" name="lastName" value={employee.lastName}
                    onChange={handleChange}
                />

                <label>Email address:</label>
                <input type="email" name="email" value={employee.email}
                    onChange={handleChange} required />

                <div className='toggle-link'>
                    <button type="button" onClick={() => setShowPasswordFields(!showPasswordFields)}>
                        {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                </div>

                {showPasswordFields && (
                    <>
                        <label>New Password:</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />

                        <label>Confirm New Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </>
                )}

                <label htmlFor='hr-checkbox'>Give HR permissions</label>
                <input type='checkbox' name='hrPermission' id='hr-checkbox' checked={employee.hrPermission} onChange={handleChange} />

                <button type="submit">Update</button>
            </form>
            <div className="toggle-link">
                <p><button onClick={() => setShowDeleteBox(true)}>Delete employee</button></p>
            </div>
            {showDeleteBox &&
                <DeleteWarning setShowDeleteBox={setShowDeleteBox} setCurrentPage={setCurrentPage} />
            }
            <div className="toggle-link">
                <p><button onClick={() => setCurrentPage('Employees')}>Back to employees page</button></p>
            </div>
        </div>
    )
}

export default UpdateEmployee;