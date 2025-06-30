// FeeReceipt.jsx
import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica'
    },
    orgTitle: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'extrabold',
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    orgEmail: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
        color: '#444'
    },
    receiptTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 30,
        textTransform: 'uppercase',
        textDecoration: 'underline'
    },
    section: {
        marginBottom: 20
    },
    label: {
        fontWeight: 'bold',
        width: 100
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: '#333',
        marginVertical: 15
    },
    value: {
        flex: 1
    }
});

function FeeReceipt({ paymentData }) {
    const [userData, setUserData] = useState({});
    const userId = paymentData.paidBy;

    useEffect(function () {
        async function fetchUserData() {
            if (!userId) return;

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await res.json();

                if (result.hasError) {
                    console.log("Error: ", result.message);
                    return;
                }

                console.log("Data: ", result);
                setUserData(result.data);
            } catch (error) {
                console.log("Error: ", error);
            }
        }

        fetchUserData();
    }, [userId]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header Section */}
                <Text style={styles.orgTitle}>Campus Sphere</Text>
                <Text style={styles.orgEmail}>campus.sphere7@gmail.com</Text>

                {/* Fee Receipt Title */}
                <Text style={styles.receiptTitle}>Fee Receipt</Text>

                {/* Student Info */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{`${userData?.name?.firstName} ${userData?.name?.lastName}`}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Student Email:</Text>
                        <Text style={styles.value}>
                            <Link src={`mailto:${userData.email}`}>{userData.email}</Link>
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Department:</Text>
                        <Text style={styles.value}>{userData?.dept?.deptName}</Text>
                    </View>
                </View>

                {/* Separator Line */}
                <View style={styles.separator}></View>

                {/* Payment Info */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fees Title:</Text>
                        <Text style={styles.value}>{paymentData.title}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Payment Date:</Text>
                        <Text style={styles.value}>{new Date(paymentData.paidOn).toLocaleDateString("en-IN")}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Generated:</Text>
                        <Text style={styles.value}>{new Date().toLocaleDateString("en-IN")}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Amount Paid:</Text>
                        <Text style={styles.value}>Rs. {paymentData.amount}</Text>
                    </View>

                    {paymentData.penalty && <View style={styles.row}>
                        <Text style={styles.label}>Penalty Paid:</Text>
                        <Text style={styles.value}>Rs. {paymentData.penalty}</Text>
                    </View>
                    }

                    <View style={styles.row}>
                        <Text style={styles.label}>Total Amount Paid:</Text>
                        <Text style={styles.label}>Rs. {paymentData.amount + (paymentData?.penalty || 0)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={{ marginTop: 40 }}>
                    <Text>Thank you for your payment. In case of any query, Feel free to Contat us.</Text>
                </View>

            </Page>
        </Document>
    );
};

export default FeeReceipt;
