import * as React from "react"
import {
    TableContainer,
    Table,
    Tr,
    Td,
    Tbody,
    Thead,
    TableCaption,
    Tfoot,
    Th
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";

const AppsTable = ({ applications }) => {
    const navigate = useNavigate()

    function compare(a, b) {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }

    return (
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>All applications that you have created</TableCaption>
                <Thead>
                    <Tr>
                        <Th>id</Th>
                        <Th>creator</Th>
                        <Th>name</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {applications.sort(compare).map(app => (
                        <Tr onClick={() => navigate("/application/" + app.id, { state: app })}>
                            <Td>{parseInt(app.id)}</Td>
                            <Td>{app.app_creator.user_username}</Td>
                            <Td>{app.app_name}</Td>
                        </Tr>
                    ))}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>id</Th>
                        <Th>creator</Th>
                        <Th>name</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}

export default AppsTable