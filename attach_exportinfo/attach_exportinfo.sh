#mongoexport -d fbt -c all_resources -f _id,file_name --csv -o filenames.csv
awk -F "\),\"" '{if(NF==2)print $1"\t"$2}' filenames.csv | sed 's/^ObjectID(//'  | sed 's/"$//' > filenames.csv.2
#node call_douban.js filenames.csv.2
# TODO
#mongoimport filenames.csv.final
