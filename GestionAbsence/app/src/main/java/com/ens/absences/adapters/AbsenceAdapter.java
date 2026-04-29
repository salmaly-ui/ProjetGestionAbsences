package com.ens.absences.adapters;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.ens.absences.R;
import com.ens.absences.models.Absence;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class AbsenceAdapter extends RecyclerView.Adapter<AbsenceAdapter.ViewHolder> {

    public interface OnAbsenceClick {
        void onClick(Absence absence);
    }

    private final List<Absence> absences;
    private final OnAbsenceClick listener;

    private final SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
    private final SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());

    public AbsenceAdapter(List<Absence> absences, OnAbsenceClick listener) {
        this.absences = absences;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_absence, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Absence a = absences.get(position);

        // Formatage des dates
        String start = formatDate(a.startDate);
        String end = formatDate(a.endDate);
        holder.tvDates.setText(start + " → " + end);

        // Calcul de la durée
        long duree = calculerDureeJours(a.startDate, a.endDate);
        if (duree > 0) {
            holder.tvDuree.setText(duree + " jour" + (duree > 1 ? "s" : ""));
        } else {
            holder.tvDuree.setText("1 jour");
        }

        // Motif (éviter null)
        String motif = (a.reason != null && !a.reason.isEmpty()) ? a.reason : "Aucun motif";
        holder.tvMotif.setText(motif);

        // Statut
        holder.tvStatut.setText(labelStatut(a.status));
        holder.tvStatut.setBackgroundColor(bgStatut(a.status));
        holder.tvStatut.setTextColor(colorStatut(a.status));

        // Clic
        holder.itemView.setOnClickListener(v -> listener.onClick(a));
    }

    @Override
    public int getItemCount() {
        return absences.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvDates, tvMotif, tvStatut, tvDuree;

        ViewHolder(View v) {
            super(v);
            tvDates = v.findViewById(R.id.tvDates);
            tvMotif = v.findViewById(R.id.tvMotif);
            tvStatut = v.findViewById(R.id.tvStatut);
            tvDuree = v.findViewById(R.id.tvDuree);
        }
    }

    private String formatDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) return "---";
        try {
            Date date = inputFormat.parse(dateStr);
            return outputFormat.format(date);
        } catch (ParseException e) {
            return dateStr;
        }
    }

    private long calculerDureeJours(String startStr, String endStr) {
        if (startStr == null || endStr == null) return 1;
        try {
            Date start = inputFormat.parse(startStr);
            Date end = inputFormat.parse(endStr);
            long diff = end.getTime() - start.getTime();
            long jours = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
            return jours > 0 ? jours : 1;
        } catch (ParseException e) {
            return 1;
        }
    }

    private String labelStatut(String s) {
        if (s == null || s.isEmpty()) return "Soumise";
        switch (s) {
            case "acceptee": return "Acceptée";
            case "refusee":  return "Refusée";
            case "en_cours": return "En vérification";
            default:         return "Soumise";
        }
    }

    private int bgStatut(String s) {
        if (s == null || s.isEmpty()) return Color.parseColor("#EFF6FF");
        switch (s) {
            case "acceptee": return Color.parseColor("#ECFDF5");
            case "refusee":  return Color.parseColor("#FEF2F2");
            case "en_cours": return Color.parseColor("#FFFBEB");
            default:         return Color.parseColor("#EFF6FF");
        }
    }

    private int colorStatut(String s) {
        if (s == null || s.isEmpty()) return Color.parseColor("#1D4ED8");
        switch (s) {
            case "acceptee": return Color.parseColor("#065F46");
            case "refusee":  return Color.parseColor("#B91C1C");
            case "en_cours": return Color.parseColor("#B45309");
            default:         return Color.parseColor("#1D4ED8");
        }
    }
}