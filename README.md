# Annotiser
Simple text annotation library
Known Issues :
1) getting incorrect offset values from window after annotating once.
2) saveannotation getting triggered unwantedly because it is called in mouseUp event, it should be called as a callback for 
    click on annotate button of annotiser widget. 
