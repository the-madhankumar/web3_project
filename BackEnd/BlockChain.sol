// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract PrescriptionStorage {
    struct Tablet {
        string tabletName;
        uint256 count;
        string[] times;
    }

    struct Prescription {
        string email;
        Tablet[] tablets;
    }

    Prescription private prescription;

    function storePrescription(string memory _email, Tablet[] memory _tablets) public {
        prescription.email = _email;
        delete prescription.tablets; 

        for (uint256 i = 0; i < _tablets.length; i++) {
            prescription.tablets.push(
                Tablet({
                    tabletName: _tablets[i].tabletName,
                    count: _tablets[i].count,
                    times: _tablets[i].times
                })
            );
        }
    }

    function getPrescription() public view returns (string memory, Tablet[] memory) {
        return (prescription.email, prescription.tablets);
    }

    function addTablet(string memory _tabletName, uint256 _count, string[] memory _times) public {
        prescription.tablets.push(
            Tablet({
                tabletName: _tabletName,
                count: _count,
                times: _times
            })
        );
    }
}
