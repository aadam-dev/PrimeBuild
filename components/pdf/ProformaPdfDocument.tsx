import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ProformaWithItems } from "@/lib/db/queries/proformas";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 8 },
  meta: { marginBottom: 16, color: "#666" },
  table: { marginTop: 12 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 6 },
  headerRow: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: "#333", paddingVertical: 6, fontWeight: "bold" },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "right" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1, textAlign: "right" },
  totalRow: { marginTop: 12, flexDirection: "row", justifyContent: "flex-end", fontWeight: "bold" },
});

export function ProformaPdfDocument({ proforma }: { proforma: ProformaWithItems }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Proforma — {proforma.proformaNumber}</Text>
        <Text style={styles.meta}>
          Valid until: {new Date(proforma.validUntil).toLocaleDateString()} · Status: {proforma.status}
        </Text>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.col1}>Item</Text>
            <Text style={styles.col2}>Qty</Text>
            <Text style={styles.col3}>Unit price</Text>
            <Text style={styles.col4}>Total</Text>
          </View>
          {proforma.items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.col1}>{item.productName}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>GH¢ {item.unitPrice.toLocaleString("en-GH")}</Text>
              <Text style={styles.col4}>GH¢ {item.lineTotal.toLocaleString("en-GH")}</Text>
            </View>
          ))}
        </View>
        <View style={styles.totalRow}>
          <Text>Total: GH¢ {Number(proforma.total).toLocaleString("en-GH")}</Text>
        </View>
      </Page>
    </Document>
  );
}
