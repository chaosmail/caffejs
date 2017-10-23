# Download from http://image-net.org/download-imageurls

INPUT=data/fall11_urls.txt
OUTPUT=data/imagenet_urls.js

NUM=1000

printf "var imagenet_urls = [\n" > $OUTPUT
cat $INPUT | grep flickr | shuf -n $NUM | awk '{ print "{\"label\":\""$1"\",\"url\":\""$2"\"},"; }' >> $OUTPUT
printf "];" >> $OUTPUT