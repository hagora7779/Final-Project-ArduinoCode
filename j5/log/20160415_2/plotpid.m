
col1 = rot90(outputstr3(:, 2));
col2 = rot90(outputstr3(:, 4));
dob1 = [col1{:}];
dob2 = [col2{:}];

plot(dob1, dob2);
ylabel('time');
xlabel('input');