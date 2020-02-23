#!/bin/bash
#Staging
#curl -H "Authorization:WSSE realm="SDP",profile="UsernameToken"" \
#-H "Content-Type:application/json" \
#-H "X-WSSE:UsernameToken Username="900002",PasswordDigest="jm+Pt/h2fI9Vrc3AoUrJEFMVBAQ=",Nonce="MTM3NzI0OTYwNDYzNA==",Created="2016-03-10T10:00:00Z"" \
#-H "X-RequestHeader:request TransId="201603151230451000000000000000",ServiceId="9000020000000001"" \
#-d '{"outboundSMSMessageRequest": {"address":["tel:63'"$1"'"],"senderAddress":"'"$2"'","outboundSMSTextMessage": {"message":"'"$3"'"}}}' \
#-X POST -k -v https://stg.apis.smart.com.ph:7443/1/smsmessaging/outbound/406705/requests

#Production
curl -H "Authorization:WSSE realm="SDP",profile="UsernameToken"" \
-H "Content-Type:application/json" \
-H "X-WSSE:UsernameToken Username="900002",PasswordDigest="VTJAbEYIsRGO1ajNOhtcLo7xrGM=",Nonce="MTM3NzI0OTYwNDYzNA==",Created="2016-06-07T02:03:00Z"" \
-H "X-RequestHeader:request TransId="201606091234561000000000000000",ServiceId="9000021000000001"" \
-d '{"outboundSMSMessageRequest": {"address":["tel:63'"$1"'"],"senderAddress":"'"$2"'","outboundSMSTextMessage": {"message":"'"$3"'"}}}' \
-X POST -k -v https://apis.smart.com.ph:7443/1/smsmessaging/outbound/5001/requests
